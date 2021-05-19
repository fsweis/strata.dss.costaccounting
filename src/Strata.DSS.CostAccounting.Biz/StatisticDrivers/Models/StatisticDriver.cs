using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class StatisticDriver
    {
        public Guid DriverConfigGUID { get; set; }
        public Guid MeasureGUID { get; set; }
        public Guid DataTableGUID { get; set; }
        public string Name { get; set; }
        public bool IsNew { get; set; }
        public bool IsInverted { get; set; }
        [JsonIgnore]
        public List<RuleSet> ChildRuleSets { get; set; }
        public bool HasRules { get; set; }


        public StatisticDriver()
        {
        }

        public StatisticDriver(DriverConfig driverConfigTemp, Guid dataTableGUID)
        {
            DriverConfigGUID = driverConfigTemp.DriverConfigGUID;
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