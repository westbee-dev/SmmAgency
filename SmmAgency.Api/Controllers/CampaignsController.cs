using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Core.Entity;
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

            changeableCampaign.ManagerName = campaign.ManagerName;
            changeableCampaign.TargetReelsCount = campaign.TargetReelsCount;
            changeableCampaign.BusinessId = campaign.BusinessId;
            changeableCampaign.BloggerId = campaign.BloggerId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCampaign(int id)
        {
            var deletedCampaign = await _context.Businesses.FindAsync(id);
            if (deletedCampaign == null)
                return NotFound();

            _context.Businesses.Remove(deletedCampaign);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
