using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class CostComponent
    {
        public string Name { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public Guid CostComponentRollupGuid { get; set; }
        public int CostComponentId { get; set; }
        public int SortOrder { get; set; }
       public Boolean IsUsingCompensation { get; set; }
    }
}
