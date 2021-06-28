using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class CostingConfig
    {
        public Guid CostingConfigGuid { get; set; }
        public string Name { get; set; }
        public bool IsGLCosting { get; set; }
        public bool IsPayrollCosting { get; set; }
        public Guid PayrollDataTableGuid { get; set; }
        public short FiscalYearId { get; set; }
        public CostingType Type { get; set; }
        public bool IsEditable { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid GLDataTableGuid { get; set; }
        public short DefaultChargeAllocationMethod { get; set; }
        public byte DefaultMethod { get; set; }
        public string Description { get; set; }
        public string CubePartitionName { get; set; }
        public bool IsBudgetedAndActualCosting { get; set; }
        public byte FiscalMonthId { get; set; }
        public bool IsUtilizationEntityConfigured { get; set; }
        public DateTime ModifiedAtUtc { get; set; }
        public bool IsPendingDelete { get; set; }
        [JsonIgnore]
        public ICollection<CostingResult> CostingResults { get; set; }
        public DateTime? LastPublishedUtc { get; set; }
    }
}
