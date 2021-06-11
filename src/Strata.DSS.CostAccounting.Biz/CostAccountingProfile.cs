
using AutoMapper;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;

namespace Strata.CS
{
    public  class CostAccountingProfile : Profile
    {
        public CostAccountingProfile()
        {
            CreateMap<CostingConfigEntity, CostingConfigModel>();
            CreateMap<CostingConfigModel, CostingConfigEntity>();
        }
    }
}