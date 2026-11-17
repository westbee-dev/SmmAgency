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
    public class CampaignsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public CampaignsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<PagedResult<CampaignResponseDto>>> GetCampaigns(
            int page = 1,
            int pageSize = 10,
            string? search = null,
            int? businessId = null)
        {
            var query = _context.Campaigns.AsQueryable();

            if (businessId.HasValue)
            {
                query = query.Where(c => c.BusinessId == businessId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                var matchingBusinessIds = await _context.Businesses
                    .Where(b => b.Name.ToLower().Contains(s) || b.InstagramHandle.ToLower().Contains(s))
                    .Select(b => b.Id)
                    .ToListAsync();

                query = query.Where(c => matchingBusinessIds.Contains(c.BusinessId));
            }

            var pagedCampaigns = await query.ToPagedResultAsync(x => x.Id, page, pageSize);

            var businessIds = pagedCampaigns.Items
                .Select(c => c.BusinessId)
                .Distinct()
                .ToList();

            var businesses = await _context.Businesses
                .Where(b => businessIds.Contains(b.Id))
                .ToDictionaryAsync(b => b.Id);

            var result = pagedCampaigns.MapItems(campaign =>
            {
                var dto = _mapper.Map<CampaignResponseDto>(campaign);
                if (businesses.TryGetValue(campaign.BusinessId, out var business))
                {
                    dto.BusinessName = business.Name;
                    dto.BusinessHandle = business.InstagramHandle;
                }
                else
                {
                    dto.BusinessName = "Неизвестный бизнес";
                    dto.BusinessHandle = "@";
                }
                return dto;
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<CampaignResponseDto>> GetCampaign(int id)
        {
            var campaign = await _context.Campaigns.FindAsync(id);

            if (campaign == null)
            {
                return NotFound(new { detail = $"Рекламная кампания с ID #{id} не найдена." });
            }

            var business = await _context.Businesses.FindAsync(campaign.BusinessId);

            var responseDto = _mapper.Map<CampaignResponseDto>(campaign);
            responseDto.BusinessName = business?.Name ?? "Неизвестный бизнес";
            responseDto.BusinessHandle = business?.InstagramHandle ?? "@";

            return responseDto;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CampaignResponseDto>> CreateCampaign(CreateCampaignDto dto)
        {
            var campaign = _mapper.Map<Campaign>(dto);

            var business = await _context.Businesses.FindAsync(campaign.BusinessId);
            if (business == null)
            {
                return BadRequest(new { detail = "Выбранный бизнес клиента не найден в базе данных." });
            }

            if (business.Status == BusinessStatus.InProgress)
            {
                return BadRequest(new { detail = $"У бизнеса \"{business.Name}\" уже есть активная кампания в процессе. Дождитесь ее завершения перед запуском новой." });
            }

            campaign.CreatedDate = DateTime.UtcNow;
            campaign.CompletedReelsCount = 0;
            business.Status = BusinessStatus.InProgress;

            _context.Campaigns.Add(campaign);
            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<CampaignResponseDto>(campaign);
            responseDto.BusinessName = business?.Name ?? "Неизвестный бизнес";
            responseDto.BusinessHandle = business?.InstagramHandle ?? "@";
            responseDto.CreatedDate = campaign.CreatedDate;

            return CreatedAtAction(nameof(GetCampaign), new { id = campaign.Id }, responseDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> PutCampaign(int id, UpdateCampaignDto dto)
        {
            var changeableCampaign = await _context.Campaigns.FindAsync(id);
            if (changeableCampaign == null)
                return NotFound(new { detail = $"Рекламная кампания с ID #{id} не найдена." });

            _mapper.Map(dto, changeableCampaign);

            var business = await _context.Businesses.FindAsync(changeableCampaign.BusinessId);
            if (business != null)
            {
                var campaigns = await _context.Campaigns
                    .Where(c => c.BusinessId == business.Id)
                    .ToListAsync();
                if (campaigns.Count == 0)
                {
                    business.Status = BusinessStatus.NoCampaigns;
                }
                else if (campaigns.All(c => c.CompletedReelsCount >= (c.Id == id ? dto.TargetReelsCount : c.TargetReelsCount)))
                {
                    business.Status = BusinessStatus.Completed;
                }
                else
                {
                    business.Status = BusinessStatus.InProgress;
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCampaign(int id)
        {
            var deletedCampaign = await _context.Campaigns.FindAsync(id);
            if (deletedCampaign == null)
                return NotFound(new { detail = $"Рекламная кампания с ID #{id} не найдена." });

            var hasPosts = await _context.PostStats.AnyAsync(p => p.CampaignId == id);
            if (hasPosts)
            {
                return BadRequest(new { detail = $"Нельзя удалить кампанию #{id}: к ней уже привязаны опубликованные рилсы. Сначала удалите связанные записи рилсов." });
            }

            var deletedCampaignId = deletedCampaign.Id;
            _context.Campaigns.Remove(deletedCampaign);

            var business = await _context.Businesses.FindAsync(deletedCampaign.BusinessId);
            if (business != null)
            {
                var campaignsExists = await _context.Campaigns.AnyAsync(c => c.BusinessId == business.Id && c.Id != deletedCampaignId);
                if (!campaignsExists)
                {
                    business.Status = BusinessStatus.NoCampaigns;
                }
                else
                {
                    var remainingCampaigns = await _context.Campaigns
                        .Where(c => c.BusinessId == business.Id && c.Id != deletedCampaignId)
                        .ToListAsync();
                    bool allCompleted = remainingCampaigns.Count > 0 && remainingCampaigns.All(c => c.CompletedReelsCount >= c.TargetReelsCount);
                    if (allCompleted)
                    {
                        business.Status = BusinessStatus.Completed;
                    }
                    else
                    {
                        business.Status = BusinessStatus.InProgress;
                    }
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
