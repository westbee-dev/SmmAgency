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
        public async Task<ActionResult<PagedResult<BusinessResponseDto>>> GetBusinesses(
            int page = 1,
            int pageSize = 10,
            string? search = null,
            BusinessStatus? status = null)
        {
            var query = _context.Businesses.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(b => b.Name.ToLower().Contains(s)
                    || b.InstagramHandle.ToLower().Contains(s)
                    || b.Category.ToLower().Contains(s));
            }

            if (status.HasValue)
            {
                query = query.Where(b => b.Status == status.Value);
            }

            var paged = await query.ToPagedResultAsync(x => x.Id, page, pageSize);
            return Ok(paged.MapItems(x => _mapper.Map<BusinessResponseDto>(x)));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<BusinessResponseDto>> GetBusiness(int id)
        {
            var business = await _context.Businesses.FindAsync(id);

            if (business == null)
            {
                return NotFound(new { detail = $"Бизнес клиента с ID #{id} не найден." });
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
                return BadRequest(new { detail = $"Бизнес с логином Instagram \"{dto.InstagramHandle}\" уже зарегистрирован в базе агентства." });
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
                return NotFound(new { detail = $"Бизнес клиента с ID #{id} не найден." });

            var handleExists = await _context.Businesses.AnyAsync(b => b.InstagramHandle == dto.InstagramHandle && b.Id != id);
            if (handleExists)
            {
                return BadRequest(new { detail = $"Бизнес с логином Instagram \"{dto.InstagramHandle}\" уже зарегистрирован в базе агентства." });
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
                return NotFound(new { detail = $"Бизнес клиента с ID #{id} не найден." });

            var hasCampaigns = await _context.Campaigns.AnyAsync(c => c.BusinessId == id);
            if (hasCampaigns)
            {
                return BadRequest(new { detail = $"Нельзя удалить бизнес \"{deletedBusiness.Name}\": к нему привязаны рекламные кампании. Сначала завершите или удалите связанные кампании." });
            }

            _context.Businesses.Remove(deletedBusiness);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
