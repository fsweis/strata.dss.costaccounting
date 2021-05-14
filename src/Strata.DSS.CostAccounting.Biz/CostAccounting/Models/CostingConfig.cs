using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class CostingConfig
    {
        public Guid CostingConfigGUID { get; set; }
        public string Name { get; set; }
        public bool IsGLCosting { get; set; }
        public bool IsPayrollCosting { get; set; }
        public Guid PayrollDataTableGuid { get; set; }
        public Int16 FiscalYearID { get; set; }
        public byte Type { get; set; }
        public bool IsEditable { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid GLDataTableGUID { get; set; }
        public Guid PayrollDataTableGUID { get; set; }
        public string Description { get; set; }
        public string CubePartitionName { get; set; }
        public bool IsBudgetedAndActualCosting { get; set; }
        public byte FiscalMonthID { get; set; }
        public bool IsUtilizationEntityConfigured { get; set; }
        public DateTime ModifiedAtUtc { get; set; }
        public bool IsPendingDelete { get; set; }
    }
}
