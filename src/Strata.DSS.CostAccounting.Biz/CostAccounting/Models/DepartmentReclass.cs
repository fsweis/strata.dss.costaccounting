using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class DepartmentReclass
    {
        public Guid DepartmentReclassGUID { get; set; }
        public Guid DriverConfigGUID { get; set; }
        public Guid CostingConfigGUID { get; set; }
    }
}

