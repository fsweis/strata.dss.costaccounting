using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
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
    }
}
