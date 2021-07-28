using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostComponents.Models
{
    public class CostComponentRollup
    {
        public string Name { get; set; }
        public Guid CostComponentRollupGuid { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public bool IsExcluded{ get; set; }
        [NotMapped]
        public bool IsUsed { get; set; }
    }
}


