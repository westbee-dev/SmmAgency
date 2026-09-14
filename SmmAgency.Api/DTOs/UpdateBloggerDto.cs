using SmmAgency.Core.Enums;
namespace SmmAgency.Api.DTOs
{
    public class UpdateBloggerDto
    {
        public string InstagramHandle { get; set; }
        public string InstagramUrl { get; set; }
        public int FollowersCount { get; set; }
        public double EngagementRate { get; set; }
        public BloggerStatus Status { get; set; }
    }
}
