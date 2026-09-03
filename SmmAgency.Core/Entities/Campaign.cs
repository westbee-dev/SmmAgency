using System;
using System.Collections.Generic;
using System.Text;

namespace SmmAgency.Core.Entity
{
    public class Campaign
    {
        public int Id { get; set; }
        public int BloggerId { get; set; }
        public int BusinessId { get; set; }
        public string ManagerName {  get; set; }
        public int TargetReelsCount {  get; set; }
        public int CompletedReelsCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<PostStats> PostStats { get; set; } = new List<PostStats>();
    }
}
