using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class StatisticDriver
    {
        public Guid DriverConfigGUID { get; set; }
        public Guid MeasureGUID { get; set; }
        public Guid DataTableGUID { get; set; }
        public string Name { get; set; }
        public bool IsNew { get; set; }
        public bool IsInverted { get; set; }
        public List<RuleSet> ChildRuleSets { get; set; }
        public bool HasRules { get; set; }

        public StatisticDriver()
        {
        }

        public StatisticDriver(DriverConfig driverConfigTemp, Guid dataTableGUID)
        {
            DriverConfigGUID = driverConfigTemp.DriverConfigGuid;
            MeasureGUID = driverConfigTemp.MeasureGUID;
            DataTableGUID = dataTableGUID;
            Name = driverConfigTemp.Name;
            IsNew = false;
            IsInverted = driverConfigTemp.IsInverted;
            ChildRuleSets = new List<RuleSet>();// driverConfigTemp.ChildRuleSets.ToList();
            HasRules = false;// driverConfigTemp.ChildRuleSets.Any();
        }

    }
}