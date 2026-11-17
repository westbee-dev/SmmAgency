using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class UpdateCampaignDtoValidator : AbstractValidator<UpdateCampaignDto>
    {
        public UpdateCampaignDtoValidator()
        {
            RuleFor(x => x.TargetReelsCount)
                .InclusiveBetween(1, 100)
                .WithMessage("Целевое количество рилсов должно быть в диапазоне от 1 до 100");
        }
    }
}
