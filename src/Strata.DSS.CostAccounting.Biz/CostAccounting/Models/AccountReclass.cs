using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class AccountReclass
    {
        public Guid AccountReclassGUID { get; set; }
        public Guid DriverConfigGUID { get; set; }
        public Guid CostingConfigGUID { get; set; }
    }
}
