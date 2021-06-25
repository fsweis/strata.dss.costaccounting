using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public class CostAccountingRepository : ICostAccountingRepository
    {
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;

        public CostAccountingRepository(IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }

        public async Task<IList<Measure>> GetMeasuresAsync(IList<Guid> dataTableGuids, CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var measures = await dbContext.Measures.Where(m => dataTableGuids.Contains(m.DataTableGuid) && m.MeasureGuid != Guid.Empty).ToListAsync(cancellationToken);
            return measures;
        }
        public async Task<IList<DataTable>> GetDataTablesAsync(IList<string> globalIds, CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var dataTables = await dbContext.DataTables.Where(dt => globalIds.Contains(dt.GlobalId) && dt.GlobalId != "").ToListAsync(cancellationToken);
            return dataTables;
        }
        public async Task<IList<RuleEngineIncludedMeasure>> GetRuleEngineIncludedMeasuresAsync(CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var measures = await dbContext.RuleEngineIncludedMeasures.ToListAsync(cancellationToken);
            return measures;
        }

        public async Task<IList<RuleSet>> GetRuleSetsAsync(CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var ruleSets = await dbContext.RuleSets.ToListAsync(cancellationToken);
            return ruleSets;
        }

        public async Task<IEnumerable<FiscalMonth>> GetFiscalMonthsAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var fiscalMonths = await dbContext.FiscalMonths.ToListAsync(cancellationToken);
            return fiscalMonths;
        }

        public async Task<IEnumerable<FiscalYear>> GetFiscalYearsAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var fiscalYears = await dbContext.FiscalYears.ToListAsync(cancellationToken);
            return fiscalYears;
        }
        public async Task<IEnumerable<Entity>> GetEntitiesAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entities = await dbContext.Entities.Where(x => x.Description != ""  && x.Description!= "Not Specified").OrderBy(x=>x.SortOrder).ToListAsync(cancellationToken);
            return entities;
        }
    }
}
