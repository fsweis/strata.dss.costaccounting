using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class RuleSet
    {
        public string Category { get; set; }
        public int ExecutionOrder { get; set; }
        public Guid RootRuleGroupGuid { get; set; }
        public Guid RuleSetGuid { get; set; }
        public int RuleSetId { get; set; }

    }
}
