using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class FiscalMonth
    {
        public string Name { get; set; }
        public byte FiscalMonthID { get; set; }
        public byte SortOrder { get; set; }
    }
}
