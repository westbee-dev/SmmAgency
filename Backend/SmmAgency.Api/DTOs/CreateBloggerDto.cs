namespace SmmAgency.Api.DTOs
{
    public class CreateBloggerDto
    {
        public string InstagramHandle { get; set; }
        public string InstagramUrl { get; set; }
        public int FollowersCount { get; set; }
        public double EngagementRate { get; set; }
    }
}
