using SmmAgency.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmmAgency.Core.Entity
{
    public class Business
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string InstagramHandle {  get; set; }
        public string Category { get; set; }
        public BusinessStatus Status { get; set; }
    }
}
