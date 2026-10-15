using SmmAgency.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmmAgency.Core.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string PasswordHash { get; set; }
        public UserRole Role { get; set; }
    }
}
