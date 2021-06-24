using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ICostingConfigRepository
    {
        public Task<IEnumerable<CostingConfigModel>> GetAllCostingConfigsAsync(CancellationToken cancellationToken);
        public Task<CostingConfigModel> GetCostingConfigAsync(Guid id, CancellationToken cancellationToken);
        public Task<IEnumerable<CostingConfigEntityLevelSecurity>> GetCostingConfigEntityLevelSecuritiesAsync(Guid configGuid, CancellationToken cancellationToken);
        public Task<IEnumerable<CostingConfigEntityLinkage>> GetCostingConfigEntityLinkagesAsync(Guid configGuid, CancellationToken cancellationToken);
        public Task UpdateCostingConfigEntityLinkagesAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken);
        public Task DeleteCostingConfigEntityLinkagesAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken);
        public Task AddNewCostingConfigAsync(CostingConfigModel costingConfigModel, CancellationToken cancellationToken);
        public Task<Guid> DeleteCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken);
    }
}
