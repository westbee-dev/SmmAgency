using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class CreateCampaignDtoValidator : AbstractValidator<CreateCampaignDto>
    {
        public CreateCampaignDtoValidator()
        {
            RuleFor(x => x.BusinessId)
                .GreaterThan(0)
                .WithMessage("Выберите бизнес клиента для создания рекламной кампании");

            RuleFor(x => x.TargetReelsCount)
                .InclusiveBetween(1, 100)
                .WithMessage("Целевое количество рилсов должно быть в диапазоне от 1 до 100");
        }
    }
}
