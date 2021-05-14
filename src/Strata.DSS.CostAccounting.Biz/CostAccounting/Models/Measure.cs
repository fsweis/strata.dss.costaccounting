using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class Measure
    {
        public string FriendlyName { get; set; }
        public Guid MeasureGUID { get; set; }
        public Guid DataTableGUID { get; set; }
        public string SQLColumnName { get; set; }
    }
}
