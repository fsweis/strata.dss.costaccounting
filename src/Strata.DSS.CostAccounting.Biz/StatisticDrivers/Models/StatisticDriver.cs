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
        public bool HasRules { get; set; }
        public bool IsInverted { get; set; }
        public bool IsNew { get; set; }
      
        public bool IsUsed { get; set; }
       
        public Guid RuleSetGUID { get; set; }
      


        public StatisticDriver()
        {
        }

        public StatisticDriver(DriverConfig driverConfigTemp, bool isUsed, Guid summaryDataTableGUID, Guid detailDataTableGUID)
        {
            var dtGUID = driverConfigTemp.DataTableGUID;
            if(dtGUID==summaryDataTableGUID)
            {
                dtGUID = detailDataTableGUID;
            }
            DriverConfigGUID = driverConfigTemp.DriverConfigGUID;
            MeasureGUID = driverConfigTemp.MeasureGUID;
            DataTableGUID = dtGUID;
            Name = driverConfigTemp.Name;
            IsNew = false;
            IsUsed = isUsed;
            IsInverted = driverConfigTemp.IsInverted;
            RuleSetGUID = driverConfigTemp.RuleSetGUID;
            HasRules = driverConfigTemp.RuleSetGUID != Guid.Empty;
        }

    }
}