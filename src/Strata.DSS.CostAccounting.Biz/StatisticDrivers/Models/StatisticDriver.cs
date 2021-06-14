using Strata.DSS.CostAccounting.Biz.Enums;
using System;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class StatisticDriver
    {
        public Guid DriverConfigGuid { get; set; }
        public Guid MeasureGuid { get; set; }
        public Guid DataTableGuid { get; set; }
        public string Name { get; set; }
        public bool HasRules { get; set; }
        public bool IsInverted { get; set; }
        public bool IsUsed { get; set; }
        public CostingType CostingType { get; set; }

        public StatisticDriver()
        {
        }

        public StatisticDriver(DriverConfigView driverConfigTemp, bool isUsed, bool hasRules, Guid summaryDataTableGuid, Guid detailDataTableGuid)
        {
            var dtGuid = driverConfigTemp.DataTableGuid;
            if (dtGuid == summaryDataTableGuid)
            {
                dtGuid = detailDataTableGuid;
            }
            DriverConfigGuid = driverConfigTemp.DriverConfigGuid;
            MeasureGuid = driverConfigTemp.MeasureGuid;
            DataTableGuid = dtGuid;
            Name = driverConfigTemp.Name;
            IsUsed = isUsed;
            IsInverted = driverConfigTemp.IsInverted;
            HasRules = hasRules;
            CostingType = driverConfigTemp.CostingType;
        }
    }
}