using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class UpdateCampaignDtoValidator : AbstractValidator<UpdateCampaignDto>
    {
        public UpdateCampaignDtoValidator()
        {
            RuleFor(x => x.TargetReelsCount).
                InclusiveBetween(1, 100).
                WithMessage("Значение TargetReelsCount должно быть больше 1 и меньше 100!");
        }
    }
}
