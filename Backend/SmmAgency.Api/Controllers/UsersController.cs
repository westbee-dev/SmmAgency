using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmmAgency.Api.DTOs;
using SmmAgency.Core.Entities;
using SmmAgency.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmmAgency.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Route("api/Authorization")]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public UsersController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("registration")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Registration([FromBody] RegistrationDto registrationDto)
        {
            var loginExists = await _context.Users.AnyAsync(u => u.Login == registrationDto.Login);
            if (loginExists)
                return BadRequest(new { detail = $"Пользователь с логином \"{registrationDto.Login}\" уже зарегистрирован в системе. Выберите другой логин." });

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password);
            var user = new User
            {
                Login = registrationDto.Login,
                PasswordHash = passwordHash,
                Role = registrationDto.Role
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Сотрудник \"{user.Login}\" успешно создан!" });
        }

        [HttpGet]
        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetUsers()
        {
            var users = await _context.Users
                .OrderBy(u => u.Id)
                .Select(u => new
                {
                    u.Id,
                    u.Login,
                    Role = (int)u.Role,
                    RoleName = u.Role.ToString()
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpDelete("{id:int}")]
        [HttpDelete("users/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { detail = $"Пользователь с ID #{id} не найден." });

            var currentLogin = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Name)?.Value;
            if (!string.IsNullOrEmpty(currentLogin) && user.Login.Equals(currentLogin, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { detail = "Вы не можете удалить свою собственную учетную запись администратора." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Пользователь \"{user.Login}\" успешно удален." });
        }

        [HttpPost("authorization")]
        [AllowAnonymous]
        [EnableRateLimiting("AuthLimiter")]
        public async Task<ActionResult> Authorization([FromBody] AuthorizationDto authorizationDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Login == authorizationDto.Login);
            if (user == null || !BCrypt.Net.BCrypt.Verify(authorizationDto.Password, user.PasswordHash))
            {
                return Unauthorized(new { detail = "Неверный логин или пароль. Пожалуйста, проверьте правильность введенных данных." });
            }

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, user.Login),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var secretKey = _configuration["JwtSettings:SecretKey"];
            var issuer = _configuration["JwtSettings:Issuer"];
            var audience = _configuration["JwtSettings:Audience"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = tokenString });
        }
    }
}
