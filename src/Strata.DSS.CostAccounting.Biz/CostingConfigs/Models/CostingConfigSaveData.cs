using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class CostingConfigSaveData
    {
        public CostingConfig CostingConfig { get; set; }
        public List<int> GlPayrollEntityIds { get; set; }
        public List<int> UtilizationEntityIds { get; set; }
    }
}