using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class CostingConfigEntityLevelSecurity
    {
        public int CostingConfigEntityLevelSecurityID { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public int EntityID { get; set; }
    }
}
