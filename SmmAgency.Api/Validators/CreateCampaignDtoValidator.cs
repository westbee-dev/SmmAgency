using SmmAgency.Api.DTOs;
using FluentValidation;

namespace SmmAgency.Api.Validators
{
    public class CreateCampaignDtoValidator : AbstractValidator<CreateCampaignDto>
    {
        public CreateCampaignDtoValidator()
        {
            RuleFor(x => x.BusinessId).
                GreaterThan(0).
                WithMessage("BusinessId должен быть больше нуля!");

            RuleFor(x => x.TargetReelsCount).
                InclusiveBetween(1, 100).
                WithMessage("Значение TargetReelsCount должно быть больше 1 и меньше 100!");
        }
    }
}
