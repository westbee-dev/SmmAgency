using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Core.Entity;
using SmmAgency.Core.Enums;
using SmmAgency.Data;

namespace SmmAgency.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CampaignsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CampaignsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Campaign>> GetCampaigns()
        {
            return await _context.Campaigns.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Campaign>> GetCampaign(int id)
        {
            var campaign = await _context.Campaigns.FindAsync(id);

            if (campaign == null)
            {
                return NotFound();
            }

            return campaign;
        }

        [HttpPost]
        public async Task<ActionResult> CreateCampaign(Campaign campaign)
        {
            bool businessExists = await _context.Businesses.AnyAsync(b => b.Id == campaign.BusinessId);
            if (!businessExists)
            {
                return BadRequest("Business не найден");
            }

            var business = await _context.Businesses.FindAsync(campaign.BusinessId);
            if (business == null)
            {
                return NotFound();
            }

            campaign.CreatedDate = DateTime.UtcNow;
            campaign.CompletedReelsCount = 0;
            business.Status = BusinessStatus.InProgress;

            _context.Campaigns.Add(campaign);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCampaign), new { id = campaign.Id }, campaign);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutCampaign(int id, Campaign campaign)
        {
            if (id != campaign.Id)
                return BadRequest();

            var changeableCampaign = await _context.Campaigns.FindAsync(id);
            if (changeableCampaign == null)
                return NotFound();

            changeableCampaign.TargetReelsCount = campaign.TargetReelsCount;
            changeableCampaign.BusinessId = campaign.BusinessId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCampaign(int id)
        {
            var deletedCampaign = await _context.Campaigns.FindAsync(id);
            if (deletedCampaign == null)
                return NotFound();

            var business = await _context.Businesses.FindAsync(deletedCampaign.BusinessId);
            if (business == null)
                return NotFound();

            var deletedCampaignId = deletedCampaign.Id;
            _context.Campaigns.Remove(deletedCampaign);

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

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
