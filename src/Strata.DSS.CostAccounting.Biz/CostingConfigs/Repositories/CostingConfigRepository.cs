using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.Hangfire.Jazz.Client;
using Strata.Hangfire.Jazz.Client.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Repositories
{
    public class CostingConfigRepository : ICostingConfigRepository
    {
        private readonly CostAccountingDbContext _dbContext;
        private readonly IJazzHangfireServiceClient _hangfireServiceClient;
        private readonly ICostAccountingRepository _costAccountingRepository;
        private readonly ISystemSettingRepository _systemSettingRepository;

        public CostingConfigRepository(CostAccountingDbContext dbContext, IJazzHangfireServiceClient hangfireServiceClient,
            ICostAccountingRepository costAccountingRepository, ISystemSettingRepository systemSettingRepository)
        {
            _dbContext = dbContext;
            _hangfireServiceClient = hangfireServiceClient;
            _costAccountingRepository = costAccountingRepository;
            _systemSettingRepository = systemSettingRepository;
        }

        public async Task<IEnumerable<CostingConfig>> GetAllCostingConfigsAsync(CancellationToken cancellationToken)
        {
            var costingConfigs = await _dbContext.CostingConfigs
            .Include(x => x.CostingResults.Where(r => !r.IsMarkedForDeletion && !r.IsDraft))
            .Where(x => x.CostingConfigGuid != Guid.Empty)
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);

            foreach (var costingConfig in costingConfigs)
            {
                costingConfig.LastPublishedUtc = costingConfig.CostingResults.SingleOrDefault()?.CreatedAtUtc;
            }

            return costingConfigs;
        }

        public async Task<CostingConfig> GetCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var costingConfig = await _dbContext.CostingConfigs.FirstOrDefaultAsync(cc => cc.CostingConfigGuid == costingConfigGuid, cancellationToken);

            return costingConfig;
        }

        public async Task<IEnumerable<CostingConfigEntityLinkage>> GetCostingConfigEntityLinkagesAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var entities = await _dbContext.CostingConfigEntityLinkages.Where(x => x.CostingConfigGuid == costingConfigGuid).ToListAsync(cancellationToken);

            return entities;
        }

        public async Task<IEnumerable<Entity>> GetFilteredEntitiesAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var isCostingEntityLevelSecurityEnabled =
                await _systemSettingRepository.GetBooleanSystemSettingByNameAsync(SystemSettingConstants.EntityLevelSecuritySystemSettingName, cancellationToken);

            var entities = await _costAccountingRepository.GetEntitiesAsync(cancellationToken);

            if (isCostingEntityLevelSecurityEnabled)
            {
                if (costingConfigGuid != Guid.Empty)
                {
                    var costingConfigEntityLevelSecurities =
                        await _dbContext.CostingConfigEntityLevelSecurities.Where(x => x.CostingConfigGuid == costingConfigGuid).ToListAsync(cancellationToken);
                    if (costingConfigEntityLevelSecurities.Any())
                    {
                        return entities.Where(x => costingConfigEntityLevelSecurities.Any(y => y.EntityId == x.EntityId));
                    }
                    else
                    {
                        return new List<Entity>();
                    }
                }
                else
                {
                    return new List<Entity>();
                }
            }

            return entities;
        }

        public async Task<CostingConfig> AddNewCostingConfigAsync(CostingConfig costingConfig, CancellationToken cancellationToken)
        {
            foreach (var entityLinkage in costingConfig.EntityLinkages.Where(e => e.EntityId == 0).ToList())
            {
                costingConfig.EntityLinkages.Remove(entityLinkage);
            }

            _dbContext.CostingConfigs.Add(costingConfig);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return costingConfig;
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
