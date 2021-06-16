using System;
using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Client.DTO
{
    public class StatisticDriverSaveData
    {
        public Guid CostingConfigGuid { get; set; }
        public List<StatisticDriver> UpdatedStatDrivers { get; set; }
        public List<Guid> DeletedStatDrivers { get; set; }
    }
}
