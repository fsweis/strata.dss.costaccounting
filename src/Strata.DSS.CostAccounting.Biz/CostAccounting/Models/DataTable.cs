using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public partial class DataTable
    {
        public string FriendlyName { get; set; }
        public Guid DataTableGUID { get; set; }
        public string GlobalID { get; set; }
    }
}
