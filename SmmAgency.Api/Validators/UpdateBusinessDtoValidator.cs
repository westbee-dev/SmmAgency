using FluentValidation;
using SmmAgency.Api.DTOs;

namespace SmmAgency.Api.Validators
{
    public class UpdateBusinessDtoValidator : AbstractValidator<UpdateBusinessDto>
    {
        public UpdateBusinessDtoValidator()
        {
            RuleFor(x => x.Name).
                NotEmpty().WithMessage("Name не должно быть пустым!").
                MaximumLength(20).WithMessage("Имя должно состоять из максимум 20-ти символов!");

            RuleFor(x => x.InstagramHandle).
                NotEmpty().WithMessage("InstagramHandle не может быть пустым!").
                Must(x => x.StartsWith("@")).WithMessage("InstagramHandle должно начинаться с @");

            RuleFor(x => x.Category).
                NotEmpty().WithMessage("Category не может быть пустым!").
                MaximumLength(40).WithMessage("Category должно состоять из максимум 40 символов!");
        }
    }
}
