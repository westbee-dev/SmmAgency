namespace SmmAgency.Api.DTOs
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
        public bool HasPrevious => PageNumber > 1;
        public bool HasNext => PageNumber < TotalPages;

        public PagedResult<TNew> MapItems<TNew>(Func<T, TNew> selector)
        {
            return new PagedResult<TNew>
            {
                Items = Items.Select(selector).ToList(),
                PageNumber = PageNumber,
                PageSize = PageSize,
                TotalCount = TotalCount
            };
        }
    }
}