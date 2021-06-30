using AutoMapper;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Entities;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using System.Linq;

namespace Strata.CS
{
    public class CostAccountingProfile : Profile
    {
        public CostAccountingProfile()
        {
            CreateMap<CostingConfigEntity, CostingConfig>()
                .ForMember(prop => prop.LastPublishedUtc, opt => opt.MapFrom(prop => prop.CostingResults.FirstOrDefault(cr => !cr.IsDraft).CreatedAtUtc));
            CreateMap<CostingConfig, CostingConfigEntity>();
        }
    }
}