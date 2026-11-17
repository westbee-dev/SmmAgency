using SmmAgency.Core.Enums;

namespace SmmAgency.Api.DTOs
{
    public class BusinessResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string InstagramHandle { get; set; }
        public string Category { get; set; }
        public BusinessStatus Status { get; set; }
    }
}
