using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public class CostAccountingRepository : ICostAccountingRepository
    {
        private readonly CostAccountingDbContext _dbContext;

        public CostAccountingRepository(CostAccountingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Measure>> GetMeasuresAsync(IList<Guid> dataTableGuids, CancellationToken cancellationToken)
        {
            var measures = await _dbContext.Measures.Where(m => dataTableGuids.Contains(m.DataTableGuid) && m.MeasureGuid != Guid.Empty).ToListAsync(cancellationToken);
            return measures;
        }

        public async Task<IEnumerable<DataTable>> GetDataTablesAsync(IList<string> globalIds, CancellationToken cancellationToken)
        {
            var dataTables = await _dbContext.DataTables.Where(dt => globalIds.Contains(dt.GlobalId) && dt.GlobalId != "").ToListAsync(cancellationToken);
            return dataTables;
        }

        public async Task<IEnumerable<RuleEngineIncludedMeasure>> GetRuleEngineIncludedMeasuresAsync(CancellationToken cancellationToken)
        {
            var measures = await _dbContext.RuleEngineIncludedMeasures.ToListAsync(cancellationToken);
            return measures;
        }

        public async Task<IEnumerable<RuleSet>> GetRuleSetsAsync(CancellationToken cancellationToken)
        {
            var ruleSets = await _dbContext.RuleSets.ToListAsync(cancellationToken);
            return ruleSets;
        }

        public async Task<IEnumerable<FiscalMonth>> GetFiscalMonthsAsync(CancellationToken cancellationToken)
        {
            var fiscalMonths = await _dbContext.FiscalMonths.ToListAsync(cancellationToken);
            return fiscalMonths;
        }

        public async Task<IEnumerable<FiscalYear>> GetFiscalYearsAsync(CancellationToken cancellationToken)
        {
            var fiscalYears = await _dbContext.FiscalYears.ToListAsync(cancellationToken);
            return fiscalYears;
        }

        public async Task<IEnumerable<Entity>> GetEntitiesAsync(CancellationToken cancellationToken)
        {
            var entities = await _dbContext.Entities.Where(x => x.Description != "" && x.Description != "Not Specified").OrderBy(x => x.SortOrder).ToListAsync(cancellationToken);
            return entities;
        }
    }
}
