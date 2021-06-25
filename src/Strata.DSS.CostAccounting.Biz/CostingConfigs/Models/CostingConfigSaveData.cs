using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class CostingConfigSaveData
    {
        public CostingConfig CostingConfig { get; set; }
        public List<int> GlPayrollEntities { get; set; }
        public List<int> UtilEntities { get; set; }
    }
}