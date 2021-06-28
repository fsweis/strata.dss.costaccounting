using Strata.DSS.CostAccounting.Biz.Attributes;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class StatisticDriver
    {
        public Guid DriverConfigGuid { get; set; }
        [NotEmpty]
        public Guid MeasureGuid { get; set; }
        public Guid DataTableGuid { get; set; }
        [Required]
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
            DataTableGuid = (Guid)dtGuid;
            Name = driverConfigTemp.Name;
            IsUsed = isUsed;
            IsInverted = driverConfigTemp.IsInverted;
            HasRules = hasRules;
            CostingType = driverConfigTemp.CostingType;
        }
    }
}