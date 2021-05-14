using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ICostAccountingRepository
    {
        public Task<IEnumerable<CostAccountingModel>> GetAllCostAccountingsAsync(CancellationToken cancellationToken);

        public Task<CostAccountingModel> GetCostAccountingAsync(Guid id, CancellationToken cancellationToken);

        public Task<CostingConfig> GetCostingConfig(Guid costingConfigGuid, CancellationToken cancellationToken);
        public Task<List<DataTable>> GetDataTables(List<string> globalIds, CancellationToken cancellationToken);
        public Task<List<Measure>> GetMeasures(List<DataTable> dataTables, CancellationToken cancellationToken);

        public Task<List<RuleEngineIncludedMeasure>> GetRuleEngineIncludedMeasures(CancellationToken cancellationToken); 
    }
}
