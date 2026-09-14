using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Api.DTOs;
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
        private readonly IMapper _mapper;

        public PostStatsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<List<PostStatResponseDto>> GetPostStats()
        {
            var postStats = await _context.PostStats.ToListAsync();
            return _mapper.Map<List<PostStatResponseDto>>(postStats);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostStatResponseDto>> GetPostStat(int id)
        {
            var postStat = await _context.PostStats.FindAsync(id);

            if (postStat == null)
            {
                return NotFound();
            }

            return _mapper.Map<PostStatResponseDto>(postStat);
        }

        [HttpPost]
        public async Task<ActionResult<PostStatResponseDto>> CreatePostStat(CreatePostStatDto dto)
        {
            var postStat = _mapper.Map<PostStat>(dto);

            var campaign = await _context.Campaigns.FindAsync(postStat.CampaignId);
            if (campaign == null)
            {
                return BadRequest("Campaign не найдена");
            }

            var blogger = await _context.Bloggers.FindAsync(postStat.BloggerId);
            if (blogger == null)
            {
                return BadRequest("Blogger не найден");
            }

            var thereIsReels = await _context.PostStats.AnyAsync(p => p.BloggerId == postStat.BloggerId
                && p.CampaignId == postStat.CampaignId);
            if (thereIsReels)
            {
                return BadRequest("Blogger уже выложил рилс для этой Campaign");
            }

            campaign.CompletedReelsCount += 1;
            blogger.Status = BloggerStatus.Posted;

            _context.PostStats.Add(postStat);
            await UpdateBusinessStatus(campaign);
            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<PostStatResponseDto>(postStat);

            return CreatedAtAction(nameof(GetPostStat), new { id = postStat.Id }, responseDto);
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
        public async Task<ActionResult> PutPostStat(int id, UpdatePostStatDto dto)
        {
            bool campaignExists = await _context.Campaigns.AnyAsync(c => dto.CampaignId == c.Id);
            if (!campaignExists)
            {
                return BadRequest("Campaign не найдена");
            }

            bool bloggerExists = await _context.Bloggers.AnyAsync(b => dto.BloggerId == b.Id);
            if (!bloggerExists)
            {
                return BadRequest("Blogger не найден");
            } 

            var changeablePostStat = await _context.PostStats.FindAsync(id);
            if (changeablePostStat == null)
                return NotFound();

            bool isUpdated = changeablePostStat.BloggerId != dto.BloggerId
                || changeablePostStat.CampaignId != dto.CampaignId;
            if (isUpdated)
            {
                bool thereIsReels = await _context.PostStats.AnyAsync(p => p.BloggerId == dto.BloggerId
                    && p.CampaignId == dto.CampaignId && p.Id != id);
                if (thereIsReels)
                {
                    return BadRequest("Blogger уже выложил рилс для этой Campaign");
                }
            }

            bool bloggerIdIsUpdated = changeablePostStat.BloggerId != dto.BloggerId;
            bool campaignIdIsUpdated = changeablePostStat.CampaignId != dto.CampaignId;

            if (bloggerIdIsUpdated)
            {
                var oldBlogger = await _context.Bloggers.FindAsync(changeablePostStat.BloggerId);
                var newBlogger = await _context.Bloggers.FindAsync(dto.BloggerId);
                if (oldBlogger == null || newBlogger == null)
                    return BadRequest("Blogger не найден");
                oldBlogger.Status = BloggerStatus.NoAnswer;
                newBlogger.Status = BloggerStatus.Posted;
            }

            if (campaignIdIsUpdated)
            {
                var oldCampaign = await _context.Campaigns.FindAsync(changeablePostStat.CampaignId);
                var newCampaign = await _context.Campaigns.FindAsync(dto.CampaignId);
                if (oldCampaign == null || newCampaign == null)
                    return BadRequest("Campaign не найдена");

                if (oldCampaign.CompletedReelsCount > 0)
                {
                    oldCampaign.CompletedReelsCount--;
                }
                await UpdateBusinessStatus(oldCampaign);

                newCampaign.CompletedReelsCount++;
                await UpdateBusinessStatus(newCampaign);
            }

            _mapper.Map(dto, changeablePostStat);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePostStat(int id)
        {
            var deletedPostStat = await _context.PostStats.FindAsync(id);
            if (deletedPostStat == null)
                return NotFound();

            var campaign = await _context.Campaigns.FindAsync(deletedPostStat.CampaignId);
            if (campaign != null)
            {
                if (campaign.CompletedReelsCount > 0)
                {
                    campaign.CompletedReelsCount--;
                }
                await UpdateBusinessStatus(campaign);
            }

            var blogger = await _context.Bloggers.FindAsync(deletedPostStat.BloggerId);
            if (blogger != null)
                blogger.Status = BloggerStatus.NoAnswer;

            _context.PostStats.Remove(deletedPostStat);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
