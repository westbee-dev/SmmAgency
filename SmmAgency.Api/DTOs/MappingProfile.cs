using AutoMapper;
using SmmAgency.Core.Entity;


namespace SmmAgency.Api.DTOs
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Blogger, BloggerResponseDto>();
            CreateMap<CreateBloggerDto, Blogger>();
            CreateMap<UpdateBloggerDto, Blogger>();

            CreateMap<Business, BusinessResponseDto>();
            CreateMap<CreateBusinessDto, Business>();
            CreateMap<UpdateBusinessDto, Business>();

            CreateMap<Campaign, CampaignResponseDto>();
            CreateMap<CreateCampaignDto, Campaign>();
            CreateMap<UpdateCampaignDto, Campaign>();

            CreateMap<PostStat, PostStatResponseDto>();
            CreateMap<CreatePostStatDto, PostStat>();
            CreateMap<UpdatePostStatDto, PostStat>();
        }
    }
}
