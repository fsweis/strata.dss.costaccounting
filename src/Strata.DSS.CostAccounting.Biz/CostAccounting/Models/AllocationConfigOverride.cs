using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class AllocationConfigOverride
    {
        public Guid AllocationConfigOverrideGuid { get; set; }
        public Guid DriverConfigGuid { get; set; }

        public Guid AllocationConfigGuid { get; set; }
        public Guid CostingConfigGuid { get; set; }
    }
}
