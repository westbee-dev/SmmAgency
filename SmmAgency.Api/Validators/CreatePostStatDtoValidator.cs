using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class CreatePostStatDtoValidator : AbstractValidator<CreatePostStatDto>
    {
        public CreatePostStatDtoValidator()
        {
            RuleFor(x => x.CampaignId).
                GreaterThan(0).WithMessage("CampaignId должен быть больше нуля!");

            RuleFor(x => x.BloggerId).
                GreaterThan(0).WithMessage("BloggerId должен быть больше нуля!");

            RuleFor(x => x.ManagerName).
                NotEmpty().WithMessage("ManagerName не может быть пустым!").
                MaximumLength(20).WithMessage("ManagerName должен состоять максимум из 20-ти символов!");

            RuleFor(x => x.PostUrl).
                NotEmpty().WithMessage("PostUrl не может быть пустым!").
                Must(u => Uri.TryCreate(u, UriKind.Absolute, out _)).WithMessage("Некоректный формат url!");

            RuleFor(x => x.Likes).
                GreaterThanOrEqualTo(0).WithMessage("Likes не может быть отрицательным!");

            RuleFor(x => x.Views).
                GreaterThanOrEqualTo(0).WithMessage("Views не может быть отрицательным!");
        }
    }
}
