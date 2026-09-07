using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Core.Entity;
using SmmAgency.Data;

namespace SmmAgency.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloggersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BloggersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Blogger>> GetBloggers()
        {
            return await _context.Bloggers.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Blogger>> GetBlogger(int id)
        {
            var blogger = await _context.Bloggers.FindAsync(id);

            if (blogger == null)
            {
                return NotFound();
            }

            return blogger;
        }

        [HttpPost]
        public async Task<ActionResult> CreateBlogger(Blogger blogger)
        {
            _context.Bloggers.Add(blogger);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBlogger), new { id = blogger.Id }, blogger);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutBlogger(int id, Blogger blogger)
        {
            if (id != blogger.Id)
                return BadRequest();

            var changeableBlogger = await _context.Bloggers.FindAsync(id);
            if (changeableBlogger == null)
                return NotFound();

            changeableBlogger.InstagramHandle = blogger.InstagramHandle;
            changeableBlogger.InstagramUrl = blogger.InstagramUrl;
            changeableBlogger.FollowersCount = blogger.FollowersCount;
            changeableBlogger.EngagementRate = blogger.EngagementRate;

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