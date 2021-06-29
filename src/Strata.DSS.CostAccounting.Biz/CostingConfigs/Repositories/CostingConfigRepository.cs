
using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.Hangfire.Jazz.Client;
using Strata.Hangfire.Jazz.Client.Models;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Repositories
{
    public class CostingConfigRepository : ICostingConfigRepository
    {
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;
        private readonly IJazzHangfireServiceClient _hangfireServiceClient;
        private readonly ICostAccountingRepository _costAccountingRepository;
        private readonly ISystemSettingRepository _systemSettingRepository;

        public CostingConfigRepository(IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory, IJazzHangfireServiceClient hangfireServiceClient,
            ICostAccountingRepository costAccountingRepository, ISystemSettingRepository systemSettingRepository)
        {
            _dbContextFactory = dbContextFactory;
            _hangfireServiceClient = hangfireServiceClient;
            _costAccountingRepository = costAccountingRepository;
            _systemSettingRepository = systemSettingRepository;
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

        public async Task<IEnumerable<Entity>> GetFilteredEntitiesAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var isCostingEntityLevelSecurityEnabled =
                await _systemSettingRepository.GetBoolSystemSettingByNameAsync(SystemSettingConstants.EntityLevelSecuritySystemSettingName, cancellationToken);

            var entities = await _costAccountingRepository.GetEntitiesAsync(cancellationToken);

            if (isCostingEntityLevelSecurityEnabled)
            {
                if (costingConfigGuid != Guid.Empty)
                {
                    await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
                    var costingConfigEntityLevelSecurities =
                        await dbContext.CostingConfigEntityLevelSecurities.Where(x => x.CostingConfigGuid == costingConfigGuid).ToListAsync(cancellationToken);
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

        private async Task AddEntityLinkagesAsync(Guid costConfigGuid, IEnumerable<CostingConfigEntityLinkage> costingConfigEntityLinkages,
                                                  List<int> entities, CancellationToken cancellationToken)
        {
            var newLinks = new List<CostingConfigEntityLinkage>();
            foreach (var id in entities.Where(e => e != 0)) //we don't want to save the 'Not Specified' entity, so filter out EntityId = 0
            {
                var existingLink = costingConfigEntityLinkages?.FirstOrDefault(e => e.EntityId == id);
                if (existingLink == null) //new link
                {
                    var ccel = new CostingConfigEntityLinkage()
                    {
                        EntityId = id,
                        CostingConfigGuid = costConfigGuid,
                        IsUtilization = false
                    };
                    newLinks.Add(ccel);
                }
            }
            if (newLinks.Count > 0)
            {
                await UpdateCostingConfigEntityLinkagesAsync(newLinks, cancellationToken);
            }
        }

        private async Task UpdateCostingConfigEntityLinkagesAsync(IEnumerable<CostingConfigEntityLinkage> costingConfigEntityLinkages, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            dbContext.CostingConfigEntityLinkages.AddRange(costingConfigEntityLinkages);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        private async Task DeleteEntityLinkagesAsync(IEnumerable<CostingConfigEntityLinkage> links, List<int> entities, CancellationToken cancellationToken)
        {
            var deleteLinks = new List<CostingConfigEntityLinkage>();
            foreach (var link in links)
            {
                var savedLink = entities.FirstOrDefault(s => s == link.EntityId);
                if (savedLink == 0) //not in list of saved entity Id's - should be deleted
                {
                    deleteLinks.Add(link);
                }
            }
            if (deleteLinks.Count > 0)
            {
                await DeleteCostingConfigEntityLinkagesAsync(deleteLinks, cancellationToken);
            }
        }

        public async Task DeleteCostingConfigEntityLinkagesAsync(IEnumerable<CostingConfigEntityLinkage> costingConfigEntityLinkages, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            dbContext.CostingConfigEntityLinkages.RemoveRange(costingConfigEntityLinkages);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        private async Task AddNewCostingConfigAsync(CostingConfig costingConfig, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            dbContext.CostingConfigs.Add(costingConfig);

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

        public async Task<CostingConfig> AddNewConfigAsync(CostingConfigSaveData costConfigSaveData, CancellationToken cancellationToken)
        {
            //assign defaults
            costConfigSaveData.CostingConfig.CostingConfigGuid = Guid.NewGuid();
            costConfigSaveData.CostingConfig.IsEditable = true;
            costConfigSaveData.CostingConfig.CubePartitionName = "";
            //these are well known datatable guids
            costConfigSaveData.CostingConfig.GLDataTableGuid = DataTableConstants.DSSGLGuid;
            costConfigSaveData.CostingConfig.PayrollDataTableGuid = DataTableConstants.PayrollSampledGuid;
            if (costConfigSaveData.CostingConfig.Type == CostingType.Claims)
            {
                costConfigSaveData.CostingConfig.IsPayrollCosting = false;
                costConfigSaveData.CostingConfig.IsGLCosting = false;
            }

            //handle add/delete linkages for existing and new configs
            await SaveEntityLinkages(costConfigSaveData.CostingConfig.CostingConfigGuid, costConfigSaveData.CostingConfig.IsUtilizationEntityConfigured,
                costConfigSaveData.GlPayrollEntities, costConfigSaveData.UtilizationEntities, cancellationToken);

            //save the config
            await AddNewCostingConfigAsync(costConfigSaveData.CostingConfig, cancellationToken);

            return costConfigSaveData.CostingConfig;
        }

        private async Task SaveEntityLinkages(Guid costConfigGuid, bool isUtilizationEntityConfigured, List<int> glPayrollEntityIds,
            List<int> utilizationEntityIds, CancellationToken cancellationToken)
        {
            var isCostingEntityLevelSecurityEnabled =
                await _systemSettingRepository.GetBoolSystemSettingByNameAsync(SystemSettingConstants.EntityLevelSecuritySystemSettingName, cancellationToken);

            var existingLinkages = await GetCostingConfigEntityLinkagesAsync(costConfigGuid, cancellationToken);
            var utilEntityLinkages = existingLinkages?.Where(l => l.IsUtilization);
            var glPayrollEntityLinkages = existingLinkages?.Where(l => !l.IsUtilization);

            //save any new gl/payroll links
            await AddEntityLinkagesAsync(costConfigGuid, glPayrollEntityLinkages, glPayrollEntityIds, cancellationToken);
            //now, delete any old gl/payroll links
            if (glPayrollEntityLinkages != null && glPayrollEntityLinkages.Any())
            {
                await DeleteEntityLinkagesAsync(glPayrollEntityLinkages, glPayrollEntityIds, cancellationToken);
            }
            //handle utilization entities
            if (isCostingEntityLevelSecurityEnabled && isUtilizationEntityConfigured)
            {
                //save any new util links
                await AddEntityLinkagesAsync(costConfigGuid, utilEntityLinkages, utilizationEntityIds, cancellationToken);
                //now, delete any old util links
                if (utilEntityLinkages != null && utilEntityLinkages.Any())
                {
                    await DeleteEntityLinkagesAsync(utilEntityLinkages, utilizationEntityIds, cancellationToken);
                }
            }
            else
            {
                if (utilEntityLinkages != null && utilEntityLinkages.Any())
                {
                    await DeleteCostingConfigEntityLinkagesAsync(utilEntityLinkages.ToList(), cancellationToken);
                }
            }
        }
    }
}
