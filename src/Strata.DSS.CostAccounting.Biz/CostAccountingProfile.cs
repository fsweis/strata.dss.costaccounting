
using AutoMapper;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System.Linq;

namespace Strata.CS
{
    public class CostAccountingProfile : Profile
    {
        public CostAccountingProfile()
        {
            CreateMap<CostingConfigEntity, CostingConfigModel>()
                .ForMember(cm => cm.LastPublishedUtc,
                opt => opt.MapFrom(src => src.CostingResults.SingleOrDefault(x => !x.IsDraft).CreatedAtUtc));
            CreateMap<CostingConfigModel, CostingConfigEntity>();
        }
    }
}