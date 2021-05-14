using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;

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
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entities = await dbContext.CostAccountings.ToListAsync(cancellationToken);
            return entities.Select(ToModel);
        }

        public async Task<CostAccountingModel> GetCostAccountingAsync(Guid id, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entity = await dbContext.CostAccountings.FindAsync(new object[] {id}, cancellationToken);

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

        public async Task<CostingConfig> GetCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var costingConfigs = await dbContext.CostingConfigs.Where(cc => cc.CostingConfigGUID == costingConfigGuid).ToListAsync(cancellationToken); 
            return costingConfigs.FirstOrDefault();
        }

        public async Task<List<Measure>> GetMeasuresAsync(List<DataTable> dataTables, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var guids = dataTables.Select(x => x.DataTableGUID).ToList();
            var measures = await dbContext.Measures.Where(m => guids.Contains(m.DataTableGUID) && m.MeasureGUID != Guid.Empty).ToListAsync(cancellationToken);
            return measures;
        }
        public async Task<List<DataTable>> GetDataTablesAsync(List<string> globalIDs, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var dataTables = await dbContext.DataTables.Where(dt => globalIDs.Contains(dt.GlobalID) && dt.GlobalID != "").ToListAsync(cancellationToken);
            return dataTables;
        }
        public async Task<List<RuleEngineIncludedMeasure>> GetRuleEngineIncludedMeasuresAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var measures = await dbContext.RuleEngineIncludedMeasures.ToListAsync(cancellationToken);
            return measures;
        }

    }
}
