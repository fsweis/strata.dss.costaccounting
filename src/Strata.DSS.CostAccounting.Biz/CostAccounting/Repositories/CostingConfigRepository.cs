using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
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
        private readonly IMapper _mapper;
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;
        private readonly IJazzHangfireServiceClient _hangfireServiceClient;

        public CostingConfigRepository(IMapper mapper, IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory, IJazzHangfireServiceClient hangfireServiceClient)
        {
            _mapper = mapper;
            _dbContextFactory = dbContextFactory;
            _hangfireServiceClient = hangfireServiceClient;
        }

        public async Task<IEnumerable<CostingConfigModel>> GetAllCostingConfigsAsync(CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var costingConfigs = await dbContext.CostingConfigs.ToListAsync(cancellationToken);
            return _mapper.Map<IEnumerable<CostingConfigModel>>(costingConfigs);
        }

        public async Task<CostingConfigModel> GetCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entity = await dbContext.CostingConfigs.FirstOrDefaultAsync(cc => cc.CostingConfigGuid == costingConfigGuid, cancellationToken);
            return _mapper.Map<CostingConfigModel>(entity);
        }

        public async Task<IEnumerable<CostingConfigEntityLinkage>> GetCostingConfigEntityLinkagesAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var entities = await dbContext.CostingConfigEntityLinkages.Where(x => x.CostingConfigGuid == costingConfigGuid).ToListAsync(cancellationToken);

            return _mapper.Map<IEnumerable<CostingConfigEntityLinkage>>(entities);
        }

        public async Task<IEnumerable<CostingConfigEntityLevelSecurity>> GetCostingConfigEntityLevelSecuritiesAsync(Guid configGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var ccels = await dbContext.CostingConfigEntityLevelSecurities.Where(x => x.CostingConfigGuid == configGuid).ToListAsync(cancellationToken);
            return _mapper.Map<IEnumerable<CostingConfigEntityLevelSecurity>>(ccels);
        }
        public async Task<IEnumerable<CostingConfigEntityLinkage>> GetCostingConfigEntityLinkagesAsync(Guid configGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var ccels = await dbContext.CostingConfigEntityLinkages.Where(x=>x.CostingConfigGuid==configGuid).ToListAsync(cancellationToken);
            return _mapper.Map<IEnumerable<CostingConfigEntityLinkage>>(ccels);
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

        public async Task AddNewCostingConfigAsync(CostingConfigModel costingConfigModel, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var newConfig = _mapper.Map<CostingConfigEntity>(costingConfigModel);
            dbContext.CostingConfigs.Add(newConfig);

            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<Guid> DeleteCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
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
