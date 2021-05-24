using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

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
        public bool IsNew { get; set; }
      
        public bool IsUsed { get; set; }
       
        public Guid RuleSetGuid { get; set; }

        public CostingType CostingType { get; set; }



        public StatisticDriver()
        {
        }

        public StatisticDriver(DriverConfigView driverConfigTemp, bool isUsed, Guid summaryDataTableGuid, Guid detailDataTableGuid)
        {
            var dtGuid = driverConfigTemp.DataTableGuid;
            if(dtGuid==summaryDataTableGuid)
            {
                dtGuid = detailDataTableGuid;
            }
            DriverConfigGuid = driverConfigTemp.DriverConfigGuid;
            MeasureGuid = driverConfigTemp.MeasureGuid;
            DataTableGuid = dtGuid;
            Name = driverConfigTemp.Name;
            IsNew = false;
            IsUsed = isUsed;
            IsInverted = driverConfigTemp.IsInverted;
            RuleSetGuid = driverConfigTemp.RuleSetGuid;
            HasRules = driverConfigTemp.RuleSetGuid != Guid.Empty;
            CostingType = driverConfigTemp.CostingType;
        }

    }
}