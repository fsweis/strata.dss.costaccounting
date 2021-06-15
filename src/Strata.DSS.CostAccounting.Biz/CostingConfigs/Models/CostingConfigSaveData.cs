using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class CostingConfigSaveData
    {
        public CostingConfigSaveData(CostingConfigModel costingCongigModel, List<int> glPayrollEntities, List<int> utilEntities)
        {
            CostingConfig = costingCongigModel;
            GlPayrollEntities = glPayrollEntities;
            UtilEntities = utilEntities;
        }

        public CostingConfigModel CostingConfig { get; set; }
        public List<int> GlPayrollEntities { get; set; }
        public List<int> UtilEntities { get; set; }
    }
}