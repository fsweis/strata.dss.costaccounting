
using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Entities;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
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
                .Include(x => x.CostingResults)
                .Where(x => x.CostingConfigGuid != Guid.Empty)
                .OrderBy(c => c.Name)
                .ToListAsync(cancellationToken);

            return costingConfigs.Select(ToModel);
        }

        public async Task<CostingConfig> GetCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.CostingConfigs.FirstOrDefaultAsync(cc => cc.CostingConfigGuid == costingConfigGuid, cancellationToken);

            return ToModel(entity);
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

        private async Task AddEntityLinkagesAsync(Guid costConfigGuid, IEnumerable<CostingConfigEntityLinkage> costingConfigEntityLinkages,
                                                  List<int> entityIds, bool isUtilization, CancellationToken cancellationToken)
        {
            var newLinks = new List<CostingConfigEntityLinkage>();
            foreach (var id in entityIds.Where(e => e != 0)) //we don't want to save the 'Not Specified' entity, so filter out EntityId = 0
            {
                var existingLink = costingConfigEntityLinkages?.FirstOrDefault(e => e.EntityId == id);
                if (existingLink == null) //new link
                {
                    var ccel = new CostingConfigEntityLinkage()
                    {
                        EntityId = id,
                        CostingConfigGuid = costConfigGuid,
                        IsUtilization = isUtilization
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
            _dbContext.CostingConfigEntityLinkages.AddRange(costingConfigEntityLinkages);
            await _dbContext.SaveChangesAsync(cancellationToken);
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
            _dbContext.CostingConfigEntityLinkages.RemoveRange(costingConfigEntityLinkages);

            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        private async Task AddNewCostingConfigAsync(CostingConfig costingConfig, CancellationToken cancellationToken)
        {
            _dbContext.CostingConfigs.Add(ToEntity(costingConfig));

            await _dbContext.SaveChangesAsync(cancellationToken);
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
            var costingConfig = costConfigSaveData.CostingConfig;
            costingConfig.CostingConfigGuid = Guid.NewGuid();
            costingConfig.IsEditable = true;
            costingConfig.CubePartitionName = "";
            //these are well known datatable guids
            costingConfig.GLDataTableGuid = DataTableConstants.DSSGLGuid;
            costingConfig.PayrollDataTableGuid = DataTableConstants.PayrollSampledGuid;
            if (costingConfig.Type == CostingType.Claims)
            {
                costingConfig.IsPayrollCosting = false;
                costingConfig.IsGLCosting = false;
            }

            //handle add/delete linkages for existing and new configs
            await SaveEntityLinkages(costConfigSaveData, cancellationToken);

            //save the config
            await AddNewCostingConfigAsync(costingConfig, cancellationToken);

            return costConfigSaveData.CostingConfig;
        }

        private async Task SaveEntityLinkages(CostingConfigSaveData costingConfigSaveData, CancellationToken cancellationToken)
        {
            var isCostingEntityLevelSecurityEnabled =
                await _systemSettingRepository.GetBooleanSystemSettingByNameAsync(SystemSettingConstants.EntityLevelSecuritySystemSettingName, cancellationToken);

            var costingConfig = costingConfigSaveData.CostingConfig;

            var existingLinkages = await GetCostingConfigEntityLinkagesAsync(costingConfig.CostingConfigGuid, cancellationToken);
            var utilizationEntityLinkages = existingLinkages?.Where(l => l.IsUtilization);
            var glPayrollEntityLinkages = existingLinkages?.Where(l => !l.IsUtilization);

            //save any new gl/payroll links
            await AddEntityLinkagesAsync(costingConfig.CostingConfigGuid, glPayrollEntityLinkages, costingConfigSaveData.GlPayrollEntityIds, false, cancellationToken);
            //now, delete any old gl/payroll links
            if (glPayrollEntityLinkages != null && glPayrollEntityLinkages.Any())
            {
                await DeleteEntityLinkagesAsync(glPayrollEntityLinkages, costingConfigSaveData.GlPayrollEntityIds, cancellationToken);
            }
            //handle utilization entities
            if (isCostingEntityLevelSecurityEnabled && costingConfig.IsUtilizationEntityConfigured)
            {
                //save any new utilization links
                await AddEntityLinkagesAsync(costingConfig.CostingConfigGuid, utilizationEntityLinkages, costingConfigSaveData.UtilizationEntityIds, true, cancellationToken);
                //now, delete any old utilization links
                if (utilizationEntityLinkages != null && utilizationEntityLinkages.Any())
                {
                    await DeleteEntityLinkagesAsync(utilizationEntityLinkages, costingConfigSaveData.UtilizationEntityIds, cancellationToken);
                }
            }
            else
            {
                if (utilizationEntityLinkages != null && utilizationEntityLinkages.Any())
                {
                    await DeleteCostingConfigEntityLinkagesAsync(utilizationEntityLinkages.ToList(), cancellationToken);
                }
            }
        }

        private static CostingConfig ToModel(CostingConfigEntity costingConfigEntity)
        {
            var config = new CostingConfig();
            config.LastPublishedUtc = costingConfigEntity.CostingResults.SingleOrDefault(x => !x.IsDraft)?.CreatedAtUtc;
            //todo rest of stuff maybe bring back auto mapper

            return config;
        }

        private static CostingConfigEntity ToEntity(CostingConfig costingConfig)
        {
            var costingConfigEntity = new CostingConfigEntity();
            //todo rest of stuff maybe bring back auto mapper

            return costingConfigEntity;
        }
    }
}
