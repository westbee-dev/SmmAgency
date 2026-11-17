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
                .NotEmpty().WithMessage("Укажите логин сотрудника")
                .MinimumLength(3).WithMessage("Логин сотрудника должен содержать не менее 3 символов")
                .MaximumLength(20).WithMessage("Логин сотрудника должен содержать не более 20 символов");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Укажите пароль сотрудника")
                .MinimumLength(6).WithMessage("Пароль сотрудника должен содержать не менее 6 символов")
                .MaximumLength(30).WithMessage("Пароль сотрудника должен содержать не более 30 символов");

            RuleFor(x => x.Role)
                .Must(role => Enum.IsDefined(typeof(UserRole), role))
                .WithMessage("Выберите корректную роль сотрудника: Менеджер (0) или Администратор (1)");
        }
    }
}
