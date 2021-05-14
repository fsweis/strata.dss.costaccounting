using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class RuleSet
    {
        public string Category { get; set; }
        public int ExecutionOrder { get; set; }
        public Guid RootRuleGroupGUID { get; set; }
        public Guid RuleSetGUID { get; set; }
        public int RuleSetID { get; set; }

    }
}
