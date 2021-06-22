using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class Entity
    {
        public int EntityId { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public int SortOrder { get; set; }
        public string Name { get; set; }
    }
}
