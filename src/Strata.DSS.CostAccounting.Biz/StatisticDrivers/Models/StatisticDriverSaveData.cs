using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.Shared.Models;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class StatisticDriverSaveData : SaveDataBase<StatisticDriver>
    {
        public CostingType CostingType { get; set; }
    }

}