using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class CreatePostStatDtoValidator : AbstractValidator<CreatePostStatDto>
    {
        public CreatePostStatDtoValidator()
        {
            RuleFor(x => x.CampaignId)
                .GreaterThan(0).WithMessage("Выберите рекламную кампанию из списка");

            RuleFor(x => x.BloggerId)
                .GreaterThan(0).WithMessage("Выберите блогера из списка");

            RuleFor(x => x.ManagerName)
                .NotEmpty().WithMessage("Укажите имя ответственного менеджера")
                .MaximumLength(20).WithMessage("Имя менеджера не должно превышать 20 символов");

            RuleFor(x => x.PostUrl)
                .NotEmpty().WithMessage("Укажите ссылку на опубликованный рилс")
                .Must(u => Uri.TryCreate(u, UriKind.Absolute, out _)).WithMessage("Введите корректную ссылку на рилс (начинается с https://)");

            RuleFor(x => x.Likes)
                .GreaterThanOrEqualTo(0).WithMessage("Количество лайков не может быть отрицательным числом");

            RuleFor(x => x.Views)
                .GreaterThanOrEqualTo(0).WithMessage("Количество просмотров не может быть отрицательным числом");
        }
    }
}
