using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    public interface ICostingConfigService
    {
        public Task<CostingConfigModel> AddNewConfigAsync(CostingConfigSaveData costConfigSaveData, CancellationToken cancellationToken);
    }
}
