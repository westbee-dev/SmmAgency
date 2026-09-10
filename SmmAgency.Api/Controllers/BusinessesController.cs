using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Core.Entity;
using SmmAgency.Data;
using SmmAgency.Core.Enums;

namespace SmmAgency.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BusinessesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Business>> GetBusinesses()
        {
            return await _context.Businesses.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Business>> GetBusiness(int id)
        {
            var business = await _context.Businesses.FindAsync(id);

            if (business == null)
            {
                return NotFound();
            }

            return business;
        }

        [HttpPost]
        public async Task<ActionResult> CreateBusiness(Business business)
        {
            business.Status = BusinessStatus.NoCampaigns;
            _context.Businesses.Add(business);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBusiness), new { id = business.Id }, business);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutBusiness(int id, Business business)
        {
            if (id != business.Id)
                return BadRequest();

            var changeableBusiness = await _context.Businesses.FindAsync(id);
            if (changeableBusiness == null)
                return NotFound();

            changeableBusiness.Name = business.Name;
            changeableBusiness.InstagramHandle = business.InstagramHandle;
            changeableBusiness.Category = business.Category;
            changeableBusiness.Status = business.Status;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBusiness(int id)
        {
            var deletedBusiness = await _context.Businesses.FindAsync(id);
            if (deletedBusiness == null)
                return NotFound();

            _context.Businesses.Remove(deletedBusiness);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
