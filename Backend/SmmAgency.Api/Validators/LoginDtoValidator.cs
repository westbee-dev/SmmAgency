using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class LoginDtoValidator : AbstractValidator<AuthorizationDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(x => x.Login)
                .NotEmpty().WithMessage("Введите логин пользователя");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Введите пароль пользователя");
        }
    }
}
