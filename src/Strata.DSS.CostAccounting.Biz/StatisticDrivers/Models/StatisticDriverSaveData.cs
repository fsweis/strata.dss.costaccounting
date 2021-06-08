using System;
using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class StatisticDriverSaveData
    {
        public Guid CostingConfigGuid { get; set; }
        public List<StatisticDriver> UpdatedStatDrivers { get; set; }
        public List<Guid> DeletedStatDrivers { get; set; }
    }

}