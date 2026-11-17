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
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<PagedResult<PostStatResponseDto>>> GetPostStats(
            int page = 1,
            int pageSize = 10,
            string? search = null,
            int? campaignId = null,
            int? bloggerId = null)
        {
            var query = _context.PostStats.AsQueryable();

            if (campaignId.HasValue)
            {
                query = query.Where(p => p.CampaignId == campaignId.Value);
            }

            if (bloggerId.HasValue)
            {
                query = query.Where(p => p.BloggerId == bloggerId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                var matchingBloggerIds = await _context.Bloggers
                    .Where(b => b.InstagramHandle.ToLower().Contains(s))
                    .Select(b => b.Id)
                    .ToListAsync();

                query = query.Where(p => p.ManagerName.ToLower().Contains(s)
                    || p.PostUrl.ToLower().Contains(s)
                    || matchingBloggerIds.Contains(p.BloggerId));
            }

            var pagedPostStats = await query.ToPagedResultAsync(x => x.Id, page, pageSize);

            var bloggerIds = pagedPostStats.Items
                .Select(p => p.BloggerId)
                .Distinct()
                .ToList();

            var bloggers = await _context.Bloggers
                .Where(b => bloggerIds.Contains(b.Id))
                .ToDictionaryAsync(b => b.Id);

            var result = pagedPostStats.MapItems(postStat =>
            {
                var dto = _mapper.Map<PostStatResponseDto>(postStat);

                if (bloggers.TryGetValue(postStat.BloggerId, out var blogger))
                {
                    dto.BloggerHandle = blogger.InstagramHandle;
                }
                else
                {
                    dto.BloggerHandle = "@unknown";
                }

                return dto;
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<PostStatResponseDto>> GetPostStat(int id)
        {
            var postStat = await _context.PostStats.FindAsync(id);

            if (postStat == null)
            {
                return NotFound(new { detail = $"Запись статистики с ID #{id} не найдена." });
            }

            var blogger = await _context.Bloggers.FindAsync(postStat.BloggerId);

            var response = _mapper.Map<PostStatResponseDto>(postStat);
            response.BloggerHandle = blogger?.InstagramHandle ?? "@unknown";

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<PostStatResponseDto>> CreatePostStat(CreatePostStatDto dto)
        {
            var postStat = _mapper.Map<PostStat>(dto);

            if (!string.IsNullOrWhiteSpace(User.Identity?.Name))
            {
                postStat.ManagerName = User.Identity.Name;
            }

            var campaign = await _context.Campaigns.FindAsync(postStat.CampaignId);
            if (campaign == null)
            {
                return BadRequest(new { detail = "Выбранная рекламная кампания не найдена в базе данных." });
            }

            var blogger = await _context.Bloggers.FindAsync(postStat.BloggerId);
            if (blogger == null)
            {
                return BadRequest(new { detail = "Выбранный блогер не найден в базе данных инфлюенсеров." });
            }

            var thereIsReels = await _context.PostStats.AnyAsync(p => p.BloggerId == postStat.BloggerId
                && p.CampaignId == postStat.CampaignId);
            if (thereIsReels)
            {
                return BadRequest(new { detail = $"Блогер {blogger.InstagramHandle} уже опубликовал рилс для этой кампании. В рамках одной кампании блогер может выложить только один рилс." });
            }

            campaign.CompletedReelsCount += 1;
            blogger.Status = BloggerStatus.Posted;

            _context.PostStats.Add(postStat);
            await UpdateBusinessStatus(campaign);
            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<PostStatResponseDto>(postStat);
            responseDto.BloggerHandle = blogger?.InstagramHandle ?? "@unknown";

            return CreatedAtAction(nameof(GetPostStat), new { id = postStat.Id }, responseDto);
        }

        private async Task UpdateBusinessStatus(Campaign campaign)
        {
            var business = await _context.Businesses.FindAsync(campaign.BusinessId);
            if (business == null) return;
            var campaigns = await _context.Campaigns
                .Where(c => c.BusinessId == campaign.BusinessId)
                .ToListAsync();
            if (campaigns.Count == 0)
            {
                business.Status = BusinessStatus.NoCampaigns;
            }
            else if (campaigns.All(c => c.CompletedReelsCount >= c.TargetReelsCount))
            {
                business.Status = BusinessStatus.Completed;
            }
            else
            {
                business.Status = BusinessStatus.InProgress;
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> PutPostStat(int id, UpdatePostStatDto dto)
        {
            bool campaignExists = await _context.Campaigns.AnyAsync(c => dto.CampaignId == c.Id);
            if (!campaignExists)
            {
                return BadRequest(new { detail = "Выбранная рекламная кампания не найдена в базе данных." });
            }

            bool bloggerExists = await _context.Bloggers.AnyAsync(b => dto.BloggerId == b.Id);
            if (!bloggerExists)
            {
                return BadRequest(new { detail = "Выбранный блогер не найден в базе данных инфлюенсеров." });
            } 

            var changeablePostStat = await _context.PostStats.FindAsync(id);
            if (changeablePostStat == null)
                return NotFound(new { detail = $"Запись статистики с ID #{id} не найдена." });

            bool isUpdated = changeablePostStat.BloggerId != dto.BloggerId
                || changeablePostStat.CampaignId != dto.CampaignId;
            if (isUpdated)
            {
                bool thereIsReels = await _context.PostStats.AnyAsync(p => p.BloggerId == dto.BloggerId
                    && p.CampaignId == dto.CampaignId && p.Id != id);
                if (thereIsReels)
                {
                    return BadRequest(new { detail = "Этот блогер уже прикреплен с рилсом к указанной кампании. Повторная публикация одного блогера в той же кампании запрещена." });
                }
            }

            bool bloggerIdIsUpdated = changeablePostStat.BloggerId != dto.BloggerId;
            bool campaignIdIsUpdated = changeablePostStat.CampaignId != dto.CampaignId;

            if (bloggerIdIsUpdated)
            {
                var oldBlogger = await _context.Bloggers.FindAsync(changeablePostStat.BloggerId);
                var newBlogger = await _context.Bloggers.FindAsync(dto.BloggerId);
                if (oldBlogger == null || newBlogger == null)
                    return BadRequest(new { detail = "Один из блогеров не найден в базе данных." });

                var oldBloggerHasOtherPosts = await _context.PostStats
                    .AnyAsync(p => p.BloggerId == oldBlogger.Id && p.Id != id);
                if (!oldBloggerHasOtherPosts)
                {
                    oldBlogger.Status = BloggerStatus.NoAnswer;
                }
                newBlogger.Status = BloggerStatus.Posted;
            }

            if (campaignIdIsUpdated)
            {
                var oldCampaign = await _context.Campaigns.FindAsync(changeablePostStat.CampaignId);
                var newCampaign = await _context.Campaigns.FindAsync(dto.CampaignId);
                if (oldCampaign == null || newCampaign == null)
                    return BadRequest(new { detail = "Одна из кампаний не найдена в базе данных." });

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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeletePostStat(int id)
        {
            var deletedPostStat = await _context.PostStats.FindAsync(id);
            if (deletedPostStat == null)
                return NotFound(new { detail = $"Запись статистики с ID #{id} не найдена." });

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
            {
                var hasOtherPosts = await _context.PostStats
                    .AnyAsync(p => p.BloggerId == blogger.Id && p.Id != id);
                if (!hasOtherPosts)
                {
                    blogger.Status = BloggerStatus.NoAnswer;
                }
            }

            _context.PostStats.Remove(deletedPostStat);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
