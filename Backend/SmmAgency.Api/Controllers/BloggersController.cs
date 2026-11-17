using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Api.Common;
using SmmAgency.Api.DTOs;
using SmmAgency.Core.Entity;
using SmmAgency.Core.Enums;
using SmmAgency.Data;

namespace SmmAgency.Api.Controllers
{
    [Authorize(Roles = "Admin,Manager")]
    [Route("api/[controller]")]
    [ApiController]
    public class BloggersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public BloggersController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<PagedResult<BloggerResponseDto>>> GetBloggers(
            int page = 1,
            int pageSize = 10,
            string? search = null,
            BloggerStatus? status = null)
        {
            var query = _context.Bloggers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(b => b.InstagramHandle.ToLower().Contains(s)
                    || b.InstagramUrl.ToLower().Contains(s));
            }

            if (status.HasValue)
            {
                query = query.Where(b => b.Status == status.Value);
            }

            var paged = await query.ToPagedResultAsync(x => x.Id, page, pageSize);
            return Ok(paged.MapItems(x => _mapper.Map<BloggerResponseDto>(x)));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<BloggerResponseDto>> GetBlogger(int id)
        {
            var blogger = await _context.Bloggers.FindAsync(id);

            if (blogger == null)
            {
                return NotFound(new { detail = $"Инфлюенсер с ID #{id} не найден в базе данных." });
            }

            return _mapper.Map<BloggerResponseDto>(blogger);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<BloggerResponseDto>> CreateBlogger(CreateBloggerDto dto)
        {
            var handleExists = await _context.Bloggers.AnyAsync(b => b.InstagramHandle == dto.InstagramHandle);
            if (handleExists)
            {
                return BadRequest(new { detail = $"Блогер с логином Instagram \"{dto.InstagramHandle}\" уже существует в базе инфлюенсеров." });
            }

            var blogger = _mapper.Map<Blogger>(dto);
            blogger.Status = BloggerStatus.NoAnswer;
            _context.Bloggers.Add(blogger);
            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<BloggerResponseDto>(blogger);

            return CreatedAtAction(nameof(GetBlogger), new { id = blogger.Id }, responseDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> PutBlogger(int id, UpdateBloggerDto dto)
        {
            var changeableBlogger = await _context.Bloggers.FindAsync(id);
            if (changeableBlogger == null)
                return NotFound(new { detail = $"Инфлюенсер с ID #{id} не найден в базе данных." });

            var handleExists = await _context.Bloggers.AnyAsync(b => b.InstagramHandle == dto.InstagramHandle && b.Id != id);
            if (handleExists)
            {
                return BadRequest(new { detail = $"Блогер с логином Instagram \"{dto.InstagramHandle}\" уже существует в базе инфлюенсеров." });
            }
            
            _mapper.Map(dto, changeableBlogger);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteBlogger(int id)
        {
            var deletedBlogger = await _context.Bloggers.FindAsync(id);
            if (deletedBlogger == null)
                return NotFound(new { detail = $"Инфлюенсер с ID #{id} не найден в базе данных." });

            var hasPosts = await _context.PostStats.AnyAsync(p => p.BloggerId == id);
            if (hasPosts)
            {
                return BadRequest(new { detail = $"Нельзя удалить блогера {deletedBlogger.InstagramHandle}: к нему привязаны опубликованные рилсы. Сначала удалите связанные записи статистики рилсов." });
            }

            _context.Bloggers.Remove(deletedBlogger);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
