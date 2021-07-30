using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.Shared.Models;
using System;

namespace Strata.DSS.CostAccounting.Biz.CostComponents.Models
{
    public class CostComponentRollupSaveData : SaveDataBase<CostComponentRollup>
    {
        public Guid CostingConfigGuid { get; set; }
    }
}
