using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using System;
using System.Linq;
using System.Collections.Generic;

using System.Threading.Tasks;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    public class CostingConfigService : ICostingConfigService
    {
        private readonly ICostingConfigRepository _costingConfigRepository;
        private readonly ICostAccountingRepository _costAccountingRepository;
        public CostingConfigService(ICostingConfigRepository costingConfigRepository, ICostAccountingRepository costAccountingRepository)
        {
            _costingConfigRepository = costingConfigRepository;
            _costAccountingRepository = costAccountingRepository;
        }

        public async Task<CostConfigSaveResult> AddNewConfigAsync(CostingConfigSaveData costConfigSaveData)
        {
            var costConfigSaveResult = new CostConfigSaveResult { Success = true, Message = "Costing Model Saved" };
            var costingConfigs = await _costingConfigRepository.GetAllCostingConfigsAsync(default);

            var isDuplicate = costingConfigs.Any(x => x.Name.Equals(costConfigSaveData.CostingConfig.Name, StringComparison.OrdinalIgnoreCase));

            if (isDuplicate)
            {
                return new CostConfigSaveResult { Success = false, Message = "Duplicate names are not allowed." };
            }

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
            await SaveEntityLinkages(costConfigSaveData.CostingConfig.CostingConfigGuid, costConfigSaveData.CostingConfig.IsUtilizationEntityConfigured, costConfigSaveData.GlPayrollEntities, costConfigSaveData.UtilEntities);
            //save the config
            await _costingConfigRepository.AddNewCostingConfigAsync(costConfigSaveData.CostingConfig, default);

            costConfigSaveResult.CostingConfig = costConfigSaveData.CostingConfig;

            return costConfigSaveResult;
        }

        private async Task SaveEntityLinkages(Guid costConfigGuid, bool isUtilizationEntityConfigured, List<int> glPayrollEntityIds, List<int> utilEntityIds)
        {
            var systemSettings = await _costingConfigRepository.GetSystemSettingsAsync(default);
            var isCostingEntityLevelSecurityEnabled = systemSettings.Any(x => x.IsCostingEntityLevelSecurityEnabled());

            var existingLinkages = await _costingConfigRepository.GetCCELinksByConfigGuidAsync(costConfigGuid, default);
            var utilEntityLinkages = existingLinkages?.Where(l => l.IsUtilization);
            var glPayrollEntityLinkages = existingLinkages?.Where(l => !l.IsUtilization);

            //save any new gl/payroll links
            await AddEntityLinkagesAsync(costConfigGuid, glPayrollEntityLinkages, glPayrollEntityIds);
            //now, delete any old gl/payroll links
            if (glPayrollEntityLinkages != null && glPayrollEntityLinkages.Count() > 0)
            {
                await DeleteEntityLinkagesAsync(glPayrollEntityLinkages, glPayrollEntityIds);
            }
            //handle utilization entities
            if (isCostingEntityLevelSecurityEnabled && isUtilizationEntityConfigured)
            {
                //save any new util links
                await AddEntityLinkagesAsync(costConfigGuid, utilEntityLinkages, utilEntityIds);
                //now, delete any old util links
                if (utilEntityLinkages != null && utilEntityLinkages.Count() > 0)
                {
                    await DeleteEntityLinkagesAsync(utilEntityLinkages, utilEntityIds);
                }
            }
            else
            {
                if (utilEntityLinkages != null && utilEntityLinkages.Count() > 0)
                {
                    await _costingConfigRepository.DeleteCCELinksAsync(utilEntityLinkages.ToList(), default);
                }
            }
        }
        private async Task AddEntityLinkagesAsync(Guid costConfigGuid, IEnumerable<CostingConfigEntityLinkage> links, List<int> entities)
        {
            var newLinks = new List<CostingConfigEntityLinkage>();
            foreach (var id in entities.Where(e => e != 0)) //we don't want to save the 'Not Specified' entity, so filter out EntityID = 0
            {
                var existingLink = links?.FirstOrDefault(e => e.EntityID == id);
                if (existingLink == null) //new link
                {
                    var ccel = new CostingConfigEntityLinkage()
                    {
                        EntityID = id,
                        CostingConfigGuid = costConfigGuid,
                        IsUtilization = false
                    };
                    newLinks.Add(ccel);
                }
            }
            if (newLinks.Count > 0)
            {
                await _costingConfigRepository.UpdateCCELinksAsync(newLinks, default);
            }
        }
        private async Task DeleteEntityLinkagesAsync(IEnumerable<CostingConfigEntityLinkage> links, List<int> entities)
        {
            var deleteLinks = new List<CostingConfigEntityLinkage>();
            foreach (CostingConfigEntityLinkage link in links)
            {
                var savedLink = entities.FirstOrDefault(s => s == link.EntityID);
                if (savedLink == 0) //not in list of saved entity ID's - should be deleted
                {
                    deleteLinks.Add(link);
                }
            }
            if (deleteLinks.Count > 0)
            {
                await _costingConfigRepository.DeleteCCELinksAsync(deleteLinks, default);
            }
        }

    }

}
