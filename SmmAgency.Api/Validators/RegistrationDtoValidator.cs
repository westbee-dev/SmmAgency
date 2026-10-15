using FluentValidation;
using SmmAgency.Api.DTOs;
using SmmAgency.Core.Enums;

namespace SmmAgency.Api.Validators
{
    public class RegistrationDtoValidator : AbstractValidator<RegistrationDto>
    {
        public RegistrationDtoValidator()
        {
            RuleFor(x => x.Login)
                .NotEmpty()
                .MinimumLength(3)
                .MaximumLength(20);

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(6)
                .MaximumLength(30);

            RuleFor(x => x.Role)
                .Must(role => Enum.IsDefined(typeof(UserRole), role))
                .WithMessage("Некорректная роль. Допустимые значения: 0 (Manager) или 1 (Admin)");
        }
    }
}
