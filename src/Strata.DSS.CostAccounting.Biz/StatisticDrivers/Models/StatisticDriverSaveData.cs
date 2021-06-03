using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class StatisticDriverSaveData
    {
        public List<StatisticDriver> AddedStatDrivers { get; set; }
        public List<StatisticDriver> UpdatedStatDrivers { get; set; }
        public List<Guid> DeletedStatDrivers { get; set; }
    }
   
}