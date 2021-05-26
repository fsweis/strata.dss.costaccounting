using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class DriverConfigView
    {
        public string Name { get; set; }
        public Guid DriverConfigGuid { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public Guid DataTableGuid { get; set; }
        public Guid MeasureGuid { get; set; }
        public CostingType CostingType { get; set; }
        public bool IsInverted { get; set; }
    }
}
