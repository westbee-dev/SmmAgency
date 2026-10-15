using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
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
    public class AuthorizationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthorizationController(IConfiguration configuration
            , AppDbContext context)
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
                return BadRequest("Логин уже существует! Войдите в существующий аккаунт или смените логин");
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password);
            var user = new User
            {
                Login = registrationDto.Login,
                PasswordHash = passwordHash,
                Role = registrationDto.Role
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok("Пользователь успешно создан!");
        }

        [HttpPost("authorization")]
        [AllowAnonymous]
        public async Task<ActionResult> Authorization([FromBody] AuthorizationDto authorizationDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Login == authorizationDto.Login);
            if (user == null)
                return Unauthorized("Неверный логин или пароль");

            if (!BCrypt.Net.BCrypt.Verify(authorizationDto.Password, user.PasswordHash))
            {
                return Unauthorized("Неверный логин или пароль");
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
