using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    public interface ICostingConfigService
    {
        public Task<CostConfigSaveResult> AddNewConfig(CostingConfigSaveData configForm);
    }
}
