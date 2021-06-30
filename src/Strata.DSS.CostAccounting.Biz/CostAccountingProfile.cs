using AutoMapper;

namespace Strata.CS
{
    public class CostAccountingProfile : Profile
    {
        public CostAccountingProfile()
        {
            //CreateMap<CostingConfigEntity, CostingConfig>()
            //    .ForMember(prop => prop.LastPublishedUtc, opt => opt.MapFrom(prop => prop.CostingResults.FirstOrDefault(cr => !cr.IsDraft).CreatedAtUtc));
            //CreateMap<CostingConfig, CostingConfigEntity>();
        }
    }
}