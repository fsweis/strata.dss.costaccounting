using Strata.DSS.CostAccounting.Biz.CostComponents.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostComponents.Repositories
{
    public interface ICostComponentsRepository
    {
        public Task<IEnumerable<CostComponentRollup>> GetCostComponentRollupsAsync(Guid costingConfigGuid, CancellationToken cancellationToken);
        public Task UpdateCostComponentRollupsAsync(List<CostComponentRollup> costComponentRollups, CancellationToken cancellationToken);
        public Task DeleteCostComponentRollupsAsync(List<Guid> costComponentRollupGuids, CancellationToken cancellationToken);
    }
}
