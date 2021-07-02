using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using System;
using System.Linq;
using System.Collections.Generic;

using System.Threading.Tasks;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using System.Threading;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    public class CostingConfigService : ICostingConfigService
    {
        private readonly ICostingConfigRepository _costingConfigRepository;
        private readonly ISystemSettingRepository _systemSettingRepository;
        public CostingConfigService(ICostingConfigRepository costingConfigRepository, ISystemSettingRepository systemSettingRepository)
        {
            _costingConfigRepository = costingConfigRepository;
            _systemSettingRepository = systemSettingRepository;
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
            await SaveEntityLinkages(costConfigSaveData.CostingConfig.CostingConfigGuid, costConfigSaveData.CostingConfig.IsUtilizationEntityConfigured, costConfigSaveData.GlPayrollEntities, costConfigSaveData.UtilizationEntities, cancellationToken);
            //save the config
            await _costingConfigRepository.AddNewCostingConfigAsync(costConfigSaveData.CostingConfig, cancellationToken);

            return costConfigSaveData.CostingConfig;
        }

        private async Task SaveEntityLinkages(Guid costConfigGuid, bool isUtilizationEntityConfigured, List<int> glPayrollEntityIds, List<int> utilEntityIds, CancellationToken cancellationToken)
        {
            var isCostingEntityLevelSecurityEnabled = await _systemSettingRepository.GetIsCostingEntityLevelSecurityEnabledAsync(cancellationToken);

            var existingLinkages = await _costingConfigRepository.GetCostingConfigEntityLinkagesAsync(costConfigGuid, cancellationToken);
            var utilEntityLinkages = existingLinkages?.Where(l => l.IsUtilization);
            var glPayrollEntityLinkages = existingLinkages?.Where(l => !l.IsUtilization);

            //save any new gl/payroll links
            await AddEntityLinkagesAsync(costConfigGuid, glPayrollEntityLinkages, glPayrollEntityIds, cancellationToken);
            //now, delete any old gl/payroll links
            if (glPayrollEntityLinkages != null && glPayrollEntityLinkages.Count() > 0)
            {
                await DeleteEntityLinkagesAsync(glPayrollEntityLinkages, glPayrollEntityIds, cancellationToken);
            }
            //handle utilization entities
            if (isCostingEntityLevelSecurityEnabled && isUtilizationEntityConfigured)
            {
                //save any new util links
                await AddEntityLinkagesAsync(costConfigGuid, utilEntityLinkages, utilEntityIds, cancellationToken);
                //now, delete any old util links
                if (utilEntityLinkages != null && utilEntityLinkages.Count() > 0)
                {
                    await DeleteEntityLinkagesAsync(utilEntityLinkages, utilEntityIds, cancellationToken);
                }
            }
            else
            {
                if (utilEntityLinkages != null && utilEntityLinkages.Count() > 0)
                {
                    await _costingConfigRepository.DeleteCostingConfigEntityLinkagesAsync(utilEntityLinkages.ToList(), cancellationToken);
                }
            }
        }
        private async Task AddEntityLinkagesAsync(Guid costConfigGuid, IEnumerable<CostingConfigEntityLinkage> links, List<int> entities, CancellationToken cancellationToken)
        {
            var newLinks = new List<CostingConfigEntityLinkage>();
            foreach (var id in entities.Where(e => e != 0)) //we don't want to save the 'Not Specified' entity, so filter out EntityId = 0
            {
                var existingLink = links?.FirstOrDefault(e => e.EntityId == id);
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
                await _costingConfigRepository.UpdateCostingConfigEntityLinkagesAsync(newLinks, cancellationToken);
            }
        }
        private async Task DeleteEntityLinkagesAsync(IEnumerable<CostingConfigEntityLinkage> links, List<int> entities, CancellationToken cancellationToken)
        {
            var deleteLinks = new List<CostingConfigEntityLinkage>();
            foreach (CostingConfigEntityLinkage link in links)
            {
                var savedLink = entities.FirstOrDefault(s => s == link.EntityId);
                if (savedLink == 0) //not in list of saved entity Id's - should be deleted
                {
                    deleteLinks.Add(link);
                }
            }
            if (deleteLinks.Count > 0)
            {
                await _costingConfigRepository.DeleteCostingConfigEntityLinkagesAsync(deleteLinks, cancellationToken);
            }
        }

    }

}
