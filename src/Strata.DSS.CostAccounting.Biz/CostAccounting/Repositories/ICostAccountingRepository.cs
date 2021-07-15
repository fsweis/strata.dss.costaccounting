using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ICostAccountingRepository
    {
        public Task<IEnumerable<DataTable>> GetDataTablesAsync(IList<string> globalIds, CancellationToken cancellationToken);
        public Task<IEnumerable<Measure>> GetMeasuresAsync(IList<Guid> dataTableGuids, CancellationToken cancellationToken);
        public Task<IEnumerable<RuleEngineIncludedMeasure>> GetRuleEngineIncludedMeasuresAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<RuleSet>> GetRuleSetsAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<FiscalMonth>> GetFiscalMonthsAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<FiscalYear>> GetFiscalYearsAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<Entity>> GetEntitiesAsync(CancellationToken cancellationToken);
    }
}
