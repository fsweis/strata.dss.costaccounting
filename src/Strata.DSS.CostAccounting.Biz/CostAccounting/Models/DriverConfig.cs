using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public partial class DriverConfig
    {
        public string Name { get; set; }
        public Guid DriverConfigGuid { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public Guid MeasureGUID { get; set; }
        public byte CostingType { get; set; }
        public bool IsInverted { get; set; }
    }
}
