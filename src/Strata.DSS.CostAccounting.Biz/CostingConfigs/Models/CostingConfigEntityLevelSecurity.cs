using System;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class CostingConfigEntityLevelSecurity
    {
        public int CostingConfigEntityLevelSecurityId { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public int EntityId { get; set; }
    }
}
