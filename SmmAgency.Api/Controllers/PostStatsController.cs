using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Core.Entity;
using SmmAgency.Data;

namespace SmmAgency.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostStatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostStatsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<PostStat>> GetPostStats()
        {
            return await _context.PostStats.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostStat>> GetPostStat(int id)
        {
            var postStat = await _context.PostStats.FindAsync(id);

            if (postStat == null)
            {
                return NotFound();
            }

            return postStat;
        }

        [HttpPost]
        public async Task<ActionResult> CreatePostStat(PostStat postStat)
        {
            _context.PostStats.Add(postStat);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPostStat), new { id = postStat.Id }, postStat);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutPostStat(int id, PostStat postStat)
        {
            if (id != postStat.Id)
                return BadRequest();

            var changeablePostStat = await _context.PostStats.FindAsync(id);
            if (changeablePostStat == null)
                return NotFound();

            changeablePostStat.PostUrl = postStat.PostUrl;
            changeablePostStat.Views = postStat.Views;
            changeablePostStat.Likes = postStat.Likes;
            changeablePostStat.CampaignId = postStat.CampaignId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePostStat(int id)
        {
            var deletedPostStat = await _context.PostStats.FindAsync(id);
            if (deletedPostStat == null)
                return NotFound();

            _context.PostStats.Remove(deletedPostStat);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
