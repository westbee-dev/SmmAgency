using System;
using System.Collections.Generic;
using System.Text;
using SmmAgency.Core.Enums;

namespace SmmAgency.Core.Entity
{
    public class Blogger
    {
        public int Id { get; set; }
        public string InstagramHandle { get; set; }
        public string InstagramUrl { get; set; }
        public int FollowersCount { get; set; }
        public double EngagementRate { get; set; }
        public BloggerStatus Status { get; set; }
    }
}
