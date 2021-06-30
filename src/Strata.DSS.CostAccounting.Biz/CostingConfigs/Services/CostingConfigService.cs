using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    /// <summary>
    /// Service that maps CostingConfigSaveData to CostingConfig model
    /// </summary>
    public class CostingConfigService : ICostingConfigService
    {
        private readonly ICostingConfigRepository _costingConfigRepository;
        private readonly ISystemSettingRepository _systemSettingRepository;

        public CostingConfigService(ICostingConfigRepository costingConfigRepository, ISystemSettingRepository systemSettingRepository)
        {
            _costingConfigRepository = costingConfigRepository;
            _systemSettingRepository = systemSettingRepository;
        }

        public async Task<CostingConfig> AddNewCostingConfigAsync(CostingConfigSaveData costingConfigSaveData, CancellationToken cancellationToken)
        {
            var costingConfig = costingConfigSaveData.CostingConfig;

            await SetEntityLinkages(costingConfigSaveData, costingConfig, cancellationToken);

            await _costingConfigRepository.AddNewCostingConfigAsync(costingConfig, cancellationToken);

            return costingConfig;
        }

        private async Task SetEntityLinkages(CostingConfigSaveData costingConfigSaveData, CostingConfig costingConfig, CancellationToken cancellationToken)
        {
            var isEntityLevelSecurityEnabled = await _systemSettingRepository.GetBooleanSystemSettingByNameAsync(SystemSettingConstants.EntityLevelSecuritySystemSettingName, cancellationToken);

            if (!isEntityLevelSecurityEnabled)
            {
                return;
            }

            costingConfig.EntityLinkages = new List<CostingConfigEntityLinkage>();

            foreach (var glPayrollEntityId in costingConfigSaveData.GlPayrollEntityIds.Where(e => e != 0))
            {
                var glPayrollEnitityLinkage = new CostingConfigEntityLinkage();
                glPayrollEnitityLinkage.EntityId = glPayrollEntityId;
                glPayrollEnitityLinkage.IsUtilization = false;

                costingConfig.EntityLinkages.Add(glPayrollEnitityLinkage);
            }

            if (!costingConfig.IsUtilizationEntityConfigured)
            {
                return;
            }

            foreach (var utilizationEntityId in costingConfigSaveData.UtilizationEntityIds.Where(e => e != 0))
            {
                var utilizationEntityLinkage = new CostingConfigEntityLinkage();
                utilizationEntityLinkage.EntityId = utilizationEntityId;
                utilizationEntityLinkage.IsUtilization = true;

                costingConfig.EntityLinkages.Add(utilizationEntityLinkage);
            }
        }
    }
}