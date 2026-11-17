namespace SmmAgency.Api.DTOs
{
    public class UpdatePostStatDto
    {
        public int CampaignId { get; set; }
        public int BloggerId { get; set; }
        public string ManagerName { get; set; } = string.Empty;
        public string PostUrl { get; set; } = string.Empty;
        public int Likes { get; set; }
        public int Views { get; set; }
        public int LikesCount { get => Likes; set => Likes = value; }
        public int ViewsCount { get => Views; set => Views = value; }
    }
}
