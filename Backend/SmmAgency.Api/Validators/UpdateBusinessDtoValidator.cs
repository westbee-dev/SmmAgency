using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class UpdateBusinessDtoValidator : AbstractValidator<UpdateBusinessDto>
    {
        public UpdateBusinessDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Название компании обязательно для заполнения")
                .MaximumLength(100).WithMessage("Название компании не должно превышать 100 символов");

            RuleFor(x => x.InstagramHandle)
                .NotEmpty().WithMessage("Instagram-аккаунт бизнеса обязателен для заполнения")
                .Must(x => x != null && x.StartsWith("@")).WithMessage("Instagram-аккаунт бизнеса должен начинаться с символа @");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Категория бизнеса обязательна для заполнения")
                .MaximumLength(40).WithMessage("Категория бизнеса не должна превышать 40 символов");
        }
    }
}
