using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class StatisticDriverSaveData
    {
        public CostingType CostingType { get; set; }
        public List<StatisticDriver> UpdatedStatDrivers { get; set; }
        public List<Guid> DeletedStatDrivers { get; set; }
    }

}