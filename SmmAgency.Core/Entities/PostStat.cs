using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace SmmAgency.Core.Entity
{
    public class PostStat
    {
        public int Id { get; set; }
        public int CampaignId {  get; set; }
        public int BloggerId { get; set; }
        public string ManagerName { get; set; }
        public string PostUrl { get; set; }
        public int Likes { get; set; }
        public int Views { get; set; }

        [JsonIgnore]
        public Campaign? Campaign { get; set; }
    }
}
