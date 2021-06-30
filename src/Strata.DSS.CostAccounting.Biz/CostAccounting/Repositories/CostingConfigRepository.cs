
using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.Hangfire.Jazz.Client;
using Strata.Hangfire.Jazz.Client.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public class CostingConfigRepository : ICostingConfigRepository
    {
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;
        private readonly IJazzHangfireServiceClient _hangfireServiceClient;

        public CostingConfigRepository(IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory, IJazzHangfireServiceClient hangfireServiceClient)
        {
            _dbContextFactory = dbContextFactory;
            _hangfireServiceClient = hangfireServiceClient;
        }

        public async Task<IEnumerable<CostingConfig>> GetAllCostingConfigsAsync(CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var costingConfigs = await dbContext.CostingConfigs.Include(x => x.CostingResults).Where(x => x.CostingConfigGuid != Guid.Empty).ToListAsync(cancellationToken);
            costingConfigs.ForEach(x => x.LastPublishedUtc = x.CostingResults.SingleOrDefault(x => !x.IsDraft)?.CreatedAtUtc);

            return costingConfigs;
        }

        public async Task<CostingConfig> GetCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entity = await dbContext.CostingConfigs.FirstOrDefaultAsync(cc => cc.CostingConfigGuid == costingConfigGuid, cancellationToken);
            return entity;
        }

        public async Task<IEnumerable<CostingConfigEntityLinkage>> GetCostingConfigEntityLinkagesAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var entities = await dbContext.CostingConfigEntityLinkages.Where(x => x.CostingConfigGuid == costingConfigGuid).ToListAsync(cancellationToken);

            return entities;
        }

        public async Task<IEnumerable<CostingConfigEntityLevelSecurity>> GetCostingConfigEntityLevelSecuritiesAsync(Guid configGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var costingConfigEntityLevelSecurities = await dbContext.CostingConfigEntityLevelSecurities.Where(x => x.CostingConfigGuid == configGuid).ToListAsync(cancellationToken);
            return costingConfigEntityLevelSecurities;
        }

        public async Task UpdateCostingConfigEntityLinkagesAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            dbContext.CostingConfigEntityLinkages.AddRange(cceLinks);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteCostingConfigEntityLinkagesAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            dbContext.CostingConfigEntityLinkages.RemoveRange(cceLinks);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task AddNewCostingConfigAsync(CostingConfig costingConfigModel, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            dbContext.CostingConfigs.Add(costingConfigModel);

            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<Guid> CreateDeleteCostingConfigTaskAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var job = new EnqueueJobDto
            {
                TaskName = "Strata.CS.Jazz.Biz.DSS.Costing.DeleteCostingConfigTask, Strata.CS.Jazz.Biz",
                ContextData = $"<guid xmlns=\"http://schemas.microsoft.com/2003/10/Serialization/\">{costingConfigGuid}</guid>"
            };

            //TODO: Create task if its not currently running? Or add isCollapsible
            var response = await _hangfireServiceClient.EnqueueJobAsync(job, cancellationToken);
            return response.JobId;

        }
    }
}
