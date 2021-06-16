using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class CostConfigSaveResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public Guid CostingConfigGuid { get; set; }
    }
}
