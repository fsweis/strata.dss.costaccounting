using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class CostingConfigEntityLinkage
    {
        public int CostingConfigEntityLinkageID { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public int EntityID { get; set; }
        public bool IsUtilization { get; set; }
    }
}
