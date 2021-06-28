using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Repositories
{
    public interface ICostingConfigRepository
    {
        public Task<IEnumerable<CostingConfig>> GetAllCostingConfigsAsync(CancellationToken cancellationToken);
        public Task<CostingConfig> GetCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken);
        public Task<IEnumerable<Entity>> GetFilteredEntitiesAsync(Guid costingConfigGuid, CancellationToken cancellationToken);
        public Task<IEnumerable<CostingConfigEntityLinkage>> GetCostingConfigEntityLinkagesAsync(Guid costingConfigGuid, CancellationToken cancellationToken);
        public Task UpdateCostingConfigEntityLinkagesAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken);
        public Task DeleteCostingConfigEntityLinkagesAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken);
        public Task AddNewCostingConfigAsync(CostingConfig costingConfigModel, CancellationToken cancellationToken);
        public Task<Guid> DeleteCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken);
    }
}
