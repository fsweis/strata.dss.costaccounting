using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Entities
{
    public class CostingConfigEntity
    {
        public Guid CostingConfigGuid { get; set; }
        public string Name { get; set; }
        public bool IsGLCosting { get; set; }
        public bool IsPayrollCosting { get; set; }
        public Guid PayrollDataTableGuid { get; set; }
        public Int16 FiscalYearId { get; set; }
        public CostingType Type { get; set; }
        public bool IsEditable { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid GLDataTableGuid { get; set; }
        public Int16 DefaultChargeAllocationMethod { get; set; }
        public string Description { get; set; }
        public string CubePartitionName { get; set; }
        public bool IsBudgetedAndActualCosting { get; set; }
        public byte FiscalMonthId { get; set; }
        public bool IsUtilizationEntityConfigured { get; set; }
        public DateTime ModifiedAtUtc { get; set; }
        public bool IsPendingDelete { get; set; }
        public ICollection<CostingResultEntity> CostingResults { get; set; }
    }
}
