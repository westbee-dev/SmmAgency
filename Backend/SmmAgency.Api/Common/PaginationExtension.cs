using Microsoft.EntityFrameworkCore;
using SmmAgency.Api.DTOs;
using System.Linq.Expressions;

namespace SmmAgency.Api.Common
{
    public static class PaginationExtensions
    {
        public static async Task<PagedResult<T>> ToPagedResultAsync<T, TKey>(
            this IQueryable<T> source,
            Expression<Func<T, TKey>> orderKeySelector,
            int pageNumber,
            int pageSize)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 50) pageSize = 50;

            var totalCount = await source.CountAsync();

            var items = await source
                .OrderBy(orderKeySelector)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<T>
            {
                Items = items,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }
    }
}
