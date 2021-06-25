using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class CostingConfigEntityLinkage
    {
        public int CostingConfigEntityLinkageId { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public int EntityId { get; set; }
        public bool IsUtilization { get; set; }
    }
}
