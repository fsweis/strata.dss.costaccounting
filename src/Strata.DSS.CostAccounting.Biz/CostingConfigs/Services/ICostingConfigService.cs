using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    public interface ICostingConfigService
    {
        public Task<CostingConfig> AddNewCostingConfigAsync(CostingConfigSaveData costingConfigSaveData, CancellationToken cancellationToken);
    }
}
