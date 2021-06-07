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
        public string FiscalMonthCode { get; set; }
        public string Abbreviation { get; set; }
        public int DaysInMonth { get; set; }
        public int YTDDaysInMonth { get; set; }
        public string MonthColumnName { get; set; }
        public int DaysInLeapYearMonth { get; set; }
        public int YTDDaysInLeapYearMonth { get; set; }
    }
}
