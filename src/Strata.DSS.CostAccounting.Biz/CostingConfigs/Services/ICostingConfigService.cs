﻿using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    public interface ICostingConfigService
    {
        public Task<CostingConfig> AddNewConfigAsync(CostingConfigSaveData costConfigSaveData, CancellationToken cancellationToken);
    }
}
