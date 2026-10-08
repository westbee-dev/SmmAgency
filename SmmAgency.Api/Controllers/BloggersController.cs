using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Api.DTOs;
using SmmAgency.Core.Entity;
using SmmAgency.Core.Enums;
using SmmAgency.Data;

namespace SmmAgency.Api.Controllers
{
    [Authorize]
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
        public async Task<List<BloggerResponseDto>> GetBloggers()
        {
            var bloggers = await _context.Bloggers.ToListAsync();
            return _mapper.Map<List<BloggerResponseDto>>(bloggers);
        }

        [HttpGet("{id}")]
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
        public async Task<ActionResult<BloggerResponseDto>> CreateBlogger(CreateBloggerDto dto)
        {
            var blogger = _mapper.Map<Blogger>(dto);
            blogger.Status = BloggerStatus.NoAnswer;
            _context.Bloggers.Add(blogger);
            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<BloggerResponseDto>(blogger);

            return CreatedAtAction(nameof(GetBlogger), new { id = blogger.Id }, responseDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutBlogger(int id, UpdateBloggerDto dto)
        {
            var changeableBlogger = await _context.Bloggers.FindAsync(id);
            if (changeableBlogger == null)
                return NotFound();
            
            _mapper.Map(dto, changeableBlogger);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
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