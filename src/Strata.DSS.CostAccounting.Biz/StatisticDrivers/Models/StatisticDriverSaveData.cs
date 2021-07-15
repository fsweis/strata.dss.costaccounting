using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class StatisticDriverSaveData : SaveDataBase<StatisticDriver>
    {
        public CostingType CostingType { get; set; }
    }

}