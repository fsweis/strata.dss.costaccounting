using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public partial class CostingConfig
    {
        public Guid CostingConfigGuid { get; set; }
        public string Name { get; set; }
        public bool IsGLCosting { get; set; }
        public bool IsPayrollCosting { get; set; }
        public Guid PayrollDataTableGuid { get; set; }
        public Int16 FiscalYearID { get; set; }
        public byte Type { get; set; }
        public bool IsEditable { get; set; }
    }
}
