using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
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

        public async Task<IEnumerable<CostAccountingModel>> GetAllCostAccountingsAsync(CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entities = await dbContext.CostAccountings.ToListAsync(cancellationToken);
            return entities.Select(ToModel);
        }

        public async Task<CostAccountingModel> GetCostAccountingAsync(Guid id, CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entity = await dbContext.CostAccountings.FindAsync(new object[] { id }, cancellationToken);

            return ToModel(entity);
        }

        public CostAccountingModel ToModel(CostAccountingEntity entity)
        {
            return new CostAccountingModel
            {
                Id = entity.Id,
                Name = entity.Name
            };
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

    }
}
