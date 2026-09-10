using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace SmmAgency.Core.Entity
{
    public class Campaign
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public int TargetReelsCount {  get; set; }
        public int CompletedReelsCount { get; set; }
        public DateTime CreatedDate { get; set; }

        [JsonIgnore]
        public List<PostStat> PostStats { get; set; } = new List<PostStat>();
    }
}
