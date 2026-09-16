using FluentValidation;
using SmmAgency.Api.DTOs;
using static System.Uri;

namespace SmmAgency.Api.Validators
{
    public class CreateBloggerDtoValidator : AbstractValidator<CreateBloggerDto>
    {
        public CreateBloggerDtoValidator()
        {
            RuleFor(x => x.EngagementRate).
                InclusiveBetween(1.5, 10).
                WithMessage("ER не подходит под условия сотрудничества, найдите другого блогера");

            RuleFor(x => x.FollowersCount).
                GreaterThan(0).
                WithMessage("FollowersCount должен быть больше нуля!");

            RuleFor(x => x.InstagramHandle).
                NotEmpty().
                WithMessage("InstagramHandle не может быть пустым!");

            RuleFor(x => x.InstagramHandle).
                Must(h => h.StartsWith("@")).
                WithMessage("InstagramHandle должен начинаться с @");

            RuleFor(x => x.InstagramUrl).
                NotEmpty().
                WithMessage("Url не может быть пустым!");

            RuleFor(x => x.InstagramUrl).
                Must(u => Uri.TryCreate(u, UriKind.Absolute, out _)).
                WithMessage("Неккоректный формат url!");
        }
    }
}
