namespace SmmAgency.Api.DTOs
{
    public class CreatePostStatDto
    {
        public int CampaignId { get; set; }
        public int BloggerId { get; set; }
        public string ManagerName { get; set; }
        public string PostUrl { get; set; }
        public int Likes { get; set; }
        public int Views { get; set; }
    }
}
