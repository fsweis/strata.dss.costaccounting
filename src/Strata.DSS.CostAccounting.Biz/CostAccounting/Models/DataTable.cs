using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class DataTable
    {
        public string FriendlyName { get; set; }
        public Guid DataTableGuid { get; set; }
        public string GlobalId { get; set; }
    }
}
