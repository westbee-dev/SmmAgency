namespace SmmAgency.Api.DTOs
{
    public class CampaignResponseDto
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public int TargetReelsCount { get; set; }
        public int CompletedReelsCount { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
