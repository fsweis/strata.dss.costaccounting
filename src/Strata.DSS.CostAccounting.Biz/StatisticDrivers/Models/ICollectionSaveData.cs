using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class ICollectionSaveData<T>
    {
        public List<T> Updated { get; set; }
        public List<Guid> DeletedGuids { get; set; }
    }

}