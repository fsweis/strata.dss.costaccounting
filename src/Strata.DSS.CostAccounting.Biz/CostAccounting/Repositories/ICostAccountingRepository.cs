using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ICostAccountingRepository
    {
        public Task<IList<DataTable>> GetDataTablesAsync(IList<string> globalIds, CancellationToken cancellationToken);
        public Task<IList<Measure>> GetMeasuresAsync(IList<Guid> dataTableGuids, CancellationToken cancellationToken);
        public Task<IList<RuleEngineIncludedMeasure>> GetRuleEngineIncludedMeasuresAsync(CancellationToken cancellationToken);
        public Task<IList<RuleSet>> GetRuleSetsAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<FiscalMonth>> GetFiscalMonthsAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<FiscalYear>> GetFiscalYearsAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<Entity>> GetEntitiesAsync(CancellationToken cancellationToken);
    }
}
