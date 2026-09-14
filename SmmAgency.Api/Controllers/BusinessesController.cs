using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Core.Entity;
using SmmAgency.Data;
using SmmAgency.Core.Enums;
using AutoMapper;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public BusinessesController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<List<BusinessResponseDto>> GetBusinesses()
        {
            var businesses = await _context.Businesses.ToListAsync();
            return _mapper.Map<List<BusinessResponseDto>>(businesses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BusinessResponseDto>> GetBusiness(int id)
        {
            var business = await _context.Businesses.FindAsync(id);

            if (business == null)
            {
                return NotFound();
            }

            return _mapper.Map<BusinessResponseDto>(business);
        }

        [HttpPost]
        public async Task<ActionResult<BusinessResponseDto>> CreateBusiness(CreateBusinessDto dto)
        {
            var business = _mapper.Map<Business>(dto);
            business.Status = BusinessStatus.NoCampaigns;

            _context.Businesses.Add(business);
            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<BusinessResponseDto>(business);

            return CreatedAtAction(nameof(GetBusiness), new { id = business.Id }, responseDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutBusiness(int id, UpdateBusinessDto dto)
        {
            var changeableBusiness = await _context.Businesses.FindAsync(id);
            if (changeableBusiness == null)
                return NotFound();

            _mapper.Map(dto, changeableBusiness);

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
