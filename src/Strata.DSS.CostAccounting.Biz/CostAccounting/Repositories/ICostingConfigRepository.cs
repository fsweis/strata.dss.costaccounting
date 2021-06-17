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
        public Task<IEnumerable<CostingConfigEntityLevelSecurity>> GetCCELSAsync(Guid configGuid, CancellationToken cancellationToken);
        public Task<IEnumerable<CostingConfigEntityLinkage>> GetCCELinksByConfigGuidAsync(Guid configGuid, CancellationToken cancellationToken);
        public Task UpdateCCELinksAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken);
        public Task DeleteCCELinksAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken);
        public Task AddNewCostingConfigAsync(CostingConfigModel costingConfigModel, CancellationToken cancellationToken);
    }
}
