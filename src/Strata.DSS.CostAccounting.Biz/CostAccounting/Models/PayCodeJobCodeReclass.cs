using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class PayCodeJobCodeReclass
    {
        public Guid PayCodeJobCodeReclassGuid { get; set; }
        public Guid DriverConfigGuid { get; set; }
        public Guid CostingConfigGuid { get; set; }
    }
}
