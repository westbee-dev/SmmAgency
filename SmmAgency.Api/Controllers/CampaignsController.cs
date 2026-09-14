using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Core.Entity;
using SmmAgency.Core.Enums;
using SmmAgency.Data;
using AutoMapper;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Controllers
{
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
        public async Task<List<CampaignResponseDto>> GetCampaigns()
        {
            var campaigns = await _context.Campaigns.ToListAsync();
            return _mapper.Map<List<CampaignResponseDto>>(campaigns);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CampaignResponseDto>> GetCampaign(int id)
        {
            var campaign = await _context.Campaigns.FindAsync(id);

            if (campaign == null)
            {
                return NotFound();
            }

            return _mapper.Map<CampaignResponseDto>(campaign);
        }

        [HttpPost]
        public async Task<ActionResult<CampaignResponseDto>> CreateCampaign(CreateCampaignDto dto)
        {
            var campaign = _mapper.Map<Campaign>(dto);

            var business = await _context.Businesses.FindAsync(campaign.BusinessId);
            if (business == null)
            {
                return BadRequest("Business не найден");
            }

            campaign.CreatedDate = DateTime.UtcNow;
            campaign.CompletedReelsCount = 0;
            business.Status = BusinessStatus.InProgress;

            _context.Campaigns.Add(campaign);
            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<CampaignResponseDto>(campaign);

            return CreatedAtAction(nameof(GetCampaign), new { id = campaign.Id }, responseDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutCampaign(int id, UpdateCampaignDto dto)
        {
            var changeableCampaign = await _context.Campaigns.FindAsync(id);
            if (changeableCampaign == null)
                return NotFound();

            _mapper.Map(dto, changeableCampaign);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCampaign(int id)
        {
            var deletedCampaign = await _context.Campaigns.FindAsync(id);
            if (deletedCampaign == null)
                return NotFound();

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
                        .Where(c => c.BusinessId == business.Id)
                        .ToListAsync();
                    bool allCompleted = remainingCampaigns.All(c => c.TargetReelsCount >= c.CompletedReelsCount && c.Id != deletedCampaignId);
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
