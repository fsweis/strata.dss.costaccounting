using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class DriverConfig
    {
        public string Name { get; set; }
        public Guid DriverConfigGUID{ get; set; }
        public Guid CostingConfigGUID { get; set; }
        public Guid DataTableGUID { get; set; }
        public Guid MeasureGUID { get; set; }
        public Guid RuleSetGUID { get; set; }
        public CostingType CostingType { get; set; }
        public bool IsInverted { get; set; }
    }
}
