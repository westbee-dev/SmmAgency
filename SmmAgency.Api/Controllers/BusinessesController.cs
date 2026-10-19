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
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<PagedResult<BusinessResponseDto>>> GetBusinesses(int page = 1, int pageSize = 10)
        {
            var paged = await _context.Businesses.ToPagedResultAsync(x => x.Id, page, pageSize);
            return Ok(paged.MapItems(x => _mapper.Map<BusinessResponseDto>(x)));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager")]
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
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<BusinessResponseDto>> CreateBusiness(CreateBusinessDto dto)
        {
            var handleExists = await _context.Businesses.AnyAsync(b => b.InstagramHandle == dto.InstagramHandle);
            if (handleExists)
            {
                return BadRequest("Бизнес с таким InstagramHandle уже существует");
            }

            var business = _mapper.Map<Business>(dto);
            business.Status = BusinessStatus.NoCampaigns;

            _context.Businesses.Add(business);
            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<BusinessResponseDto>(business);

            return CreatedAtAction(nameof(GetBusiness), new { id = business.Id }, responseDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> PutBusiness(int id, UpdateBusinessDto dto)
        {
            var changeableBusiness = await _context.Businesses.FindAsync(id);
            if (changeableBusiness == null)
                return NotFound();

            var handleExists = await _context.Businesses.AnyAsync(b => b.InstagramHandle == dto.InstagramHandle && b.Id != id);
            if (handleExists)
            {
                return BadRequest("Бизнес с таким InstagramHandle уже существует");
            }

            _mapper.Map(dto, changeableBusiness);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
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
