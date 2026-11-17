using SmmAgency.Core.Enums;

namespace SmmAgency.Api.DTOs
{
    public class RegistrationDto
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
    }
}
