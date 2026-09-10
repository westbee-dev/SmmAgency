using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Core.Entity;
using SmmAgency.Core.Enums;
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
            bool campaignExists = await _context.Campaigns.AnyAsync(c => postStat.CampaignId == c.Id);
            if (!campaignExists)
            {
                return BadRequest("Campaign не найдена");
            }

            bool bloggerExists = await _context.Bloggers.AnyAsync(b => postStat.BloggerId == b.Id);
            if (!bloggerExists)
            {
                return BadRequest("Blogger не найден");
            }

            var campaign = await _context.Campaigns.FindAsync(postStat.CampaignId);
            campaign.CompletedReelsCount += 1;

            var blogger = await _context.Bloggers.FindAsync(postStat.BloggerId);
            blogger.Status = BloggerStatus.Posted;

            _context.PostStats.Add(postStat);
            await UpdateBusinessStatus(campaign);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPostStat), new { id = postStat.Id }, postStat);
        }

        private async Task UpdateBusinessStatus(Campaign campaign)
        {
            var business = await _context.Businesses.FindAsync(campaign.BusinessId);
            if (business == null) return;

            var campaigns = await _context.Campaigns
                .Where(c => c.BusinessId == campaign.BusinessId)
                .ToListAsync();

            bool allCompleted = campaigns.Count > 0 && campaigns.All(c => c.CompletedReelsCount >= c.TargetReelsCount);
            bool isHasCompleted = campaigns.Any(c => c.CompletedReelsCount > 0);

            if (allCompleted)
            {
                business.Status = BusinessStatus.Completed;
            }

            else if (isHasCompleted)
            {
                business.Status = BusinessStatus.InProgress;
            }

            else
            {
                business.Status = BusinessStatus.NoCampaigns;
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutPostStat(int id, PostStat postStat)
        {
            if (id != postStat.Id)
                return BadRequest();

            bool campaignExists = await _context.Campaigns.AnyAsync(c => postStat.CampaignId == c.Id);
            if (!campaignExists)
            {
                return BadRequest("Campaign не найдена");
            }

            bool bloggerExists = await _context.Bloggers.AnyAsync(b => postStat.BloggerId == b.Id);
            if (!bloggerExists)
            {
                return BadRequest("Blogger не найден");
            }

            var changeablePostStat = await _context.PostStats.FindAsync(id);
            if (changeablePostStat == null)
                return NotFound();

            bool bloggerIdIsUpdated = changeablePostStat.BloggerId != postStat.BloggerId;
            bool campaignIdIsUpdated = changeablePostStat.CampaignId != postStat.CampaignId;

            if (bloggerIdIsUpdated)
            {
                var oldBlogger = await _context.Bloggers.FindAsync(changeablePostStat.BloggerId);
                var newBlogger = await _context.Bloggers.FindAsync(postStat.BloggerId);
                if (oldBlogger == null || newBlogger == null)
                    return BadRequest("Blogger не найден");
                oldBlogger.Status = BloggerStatus.NoAnswer;
                newBlogger.Status = BloggerStatus.Posted;
                changeablePostStat.BloggerId = postStat.BloggerId;
            }

            if (campaignIdIsUpdated)
            {
                var oldCampaign = await _context.Campaigns.FindAsync(changeablePostStat.CampaignId);
                var newCampaign = await _context.Campaigns.FindAsync(postStat.CampaignId);
                if (oldCampaign == null || newCampaign == null)
                    return BadRequest("Campaign не найдена");

                if (oldCampaign.CompletedReelsCount > 0)
                {
                    oldCampaign.CompletedReelsCount--;
                }
                await UpdateBusinessStatus(oldCampaign);

                newCampaign.CompletedReelsCount++;
                await UpdateBusinessStatus(newCampaign);

                changeablePostStat.CampaignId = postStat.CampaignId;
            }

            changeablePostStat.PostUrl = postStat.PostUrl;
            changeablePostStat.Views = postStat.Views;
            changeablePostStat.Likes = postStat.Likes;
            changeablePostStat.ManagerName = postStat.ManagerName;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePostStat(int id)
        {
            var deletedPostStat = await _context.PostStats.FindAsync(id);
            if (deletedPostStat == null)
                return NotFound();

            bool campaignExists = await _context.Campaigns.AnyAsync(c => deletedPostStat.CampaignId == c.Id);
            if (!campaignExists)
            {
                return BadRequest("Campaign не найдена");
            }

            bool bloggerExists = await _context.Bloggers.AnyAsync(b => deletedPostStat.BloggerId == b.Id);
            if (!bloggerExists)
            {
                return BadRequest("Blogger не найден");
            }

            var campaign = await _context.Campaigns.FindAsync(deletedPostStat.CampaignId);
            if (campaign.CompletedReelsCount > 0)
            {
                campaign.CompletedReelsCount--;
            }
            var blogger = await _context.Bloggers.FindAsync(deletedPostStat.BloggerId);
            blogger.Status = BloggerStatus.NoAnswer;

            _context.PostStats.Remove(deletedPostStat);
            await UpdateBusinessStatus(campaign);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
