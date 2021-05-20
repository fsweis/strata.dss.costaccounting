using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class PayCodeJobCodeReclass
    {
        public Guid PayCodeJobCodeReclassGUID { get; set; }
        public Guid DriverConfigGUID { get; set; }
        public Guid CostingConfigGUID { get; set; }
    }
}
