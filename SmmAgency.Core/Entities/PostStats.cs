using System;
using System.Collections.Generic;
using System.Text;

namespace SmmAgency.Core.Entity
{
    public class PostStats
    {
        public int Id { get; set; }
        public int CampaginId {  get; set; }
        public string PostUrl { get; set; }
        public int Likes { get; set; }
        public int Views { get; set; }
        public Campaign Campaign { get; set; } = null!;
    }
}
