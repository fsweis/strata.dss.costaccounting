using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class SaveDataBase<T>
    {
        public List<T> Updated { get; set; }
        public List<Guid> DeletedGuids { get; set; }
    }

}