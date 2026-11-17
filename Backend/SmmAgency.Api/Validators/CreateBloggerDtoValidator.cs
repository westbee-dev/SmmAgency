using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class CreateBloggerDtoValidator : AbstractValidator<CreateBloggerDto>
    {
        public CreateBloggerDtoValidator()
        {
            RuleFor(x => x.InstagramHandle)
                .NotEmpty().WithMessage("Укажите Instagram-аккаунт блогера")
                .Must(h => h != null && h.StartsWith("@")).WithMessage("Instagram-аккаунт блогера должен начинаться с символа @");

            RuleFor(x => x.InstagramUrl)
                .NotEmpty().WithMessage("Укажите ссылку на профиль блогера")
                .Must(u => Uri.TryCreate(u, UriKind.Absolute, out _)).WithMessage("Введите корректную ссылку на профиль блогера (начинается с https://)");

            RuleFor(x => x.FollowersCount)
                .GreaterThan(0).WithMessage("Количество подписчиков блогера должно быть больше нуля");

            RuleFor(x => x.EngagementRate)
                .InclusiveBetween(0.1, 100.0).WithMessage("Показатель вовлеченности (ER) блогера должен быть в диапазоне от 0.1% до 100.0%");
        }
    }
}
