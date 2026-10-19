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
        public async Task<ActionResult<PagedResult<BloggerResponseDto>>> GetBloggers(int page = 1, int pageSize = 10)
        {
            var paged = await _context.Bloggers.ToPagedResultAsync(x => x.Id, page, pageSize);
            return Ok(paged.MapItems(x => _mapper.Map<BloggerResponseDto>(x)));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<BloggerResponseDto>> GetBlogger(int id)
        {
            var blogger = await _context.Bloggers.FindAsync(id);

            if (blogger == null)
            {
                return NotFound();
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
                return BadRequest("Блогер с таким InstagramHandle уже существует");
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
                return NotFound();

            var handleExists = await _context.Bloggers.AnyAsync(b => b.InstagramHandle == dto.InstagramHandle && b.Id != id);
            if (handleExists)
            {
                return BadRequest("Блогер с таким InstagramHandle уже существует");
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
                return NotFound();

            _context.Bloggers.Remove(deletedBlogger);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}