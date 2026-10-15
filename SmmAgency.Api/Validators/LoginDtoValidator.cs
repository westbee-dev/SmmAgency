using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class LoginDtoValidator : AbstractValidator<AuthorizationDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(x => x.Login)
                .NotEmpty().WithMessage("Имя пользователя обязательно");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Пароль обязателен");
        }
    }
}
