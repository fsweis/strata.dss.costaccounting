using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class CostingPermissions
    {
        public bool IsClaimsCostingEnabled  { get; set; }
        public bool IsCostingEntityLevelSecurityEnabled { get; set; }
    }
}
