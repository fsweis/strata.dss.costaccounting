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
        public async Task<IList<DriverConfig>> GetStatisticDrivers(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var drivers = await dbContext.DriverConfigs.ToListAsync(cancellationToken);
            var allOnesGuid = new Guid(CostingConstants.ALL_ONES_GUID_STRING);
            drivers = drivers.Where(dc => dc.DriverConfigGuid != Guid.Empty && dc.DriverConfigGuid != allOnesGuid && dc.CostingConfigGuid == Guid.Empty).OrderBy(dr => dr.Name).ToList();
            return drivers;
        }
        public async Task<CostingConfig> GetCostingConfig(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var costingConfigs = await dbContext.CostingConfigs.ToListAsync(cancellationToken);
            var costingConfig = costingConfigs.Where(cc => cc.CostingConfigGuid == costingConfigGuid).FirstOrDefault();
            return costingConfig;
        }

        public async Task<List<Measure>> GetMeasures(List<DataTable> dataTables, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var measures = await dbContext.Measures.ToListAsync(cancellationToken);
            var guids = dataTables.Select(x => x.DataTableGUID).ToList();
            measures = measures.Where(m => guids.Contains(m.DataTableGUID) && m.MeasureGUID != Guid.Empty).ToList();
            return measures;
        }
        public async Task<List<DataTable>> GetDataTables(List<string> globalIDs, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var dataTables = await dbContext.DataTables.ToListAsync(cancellationToken);
            dataTables = dataTables.Where(dt => globalIDs.Contains(dt.GlobalID) && dt.GlobalID != "").ToList();
            return dataTables;
        }


        public async Task<List<RuleEngineIncludedMeasure>> GetRuleEngineIncludedMeasures(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var measures = await dbContext.RuleEngineIncludedMeasures.ToListAsync(cancellationToken);
            return measures;
        }

    }
}
