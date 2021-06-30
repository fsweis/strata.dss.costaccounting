using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

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

        public async Task<CostingConfig> AddNewCostingConfigAsync(CostingConfigSaveData costingConfigSaveData, CancellationToken cancellationToken)
        {
            var costingConfig = costingConfigSaveData.CostingConfig;
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

            await SetEntityLinkages(costingConfigSaveData, costingConfig, cancellationToken);

            await _costingConfigRepository.AddNewCostingConfigAsync(costingConfig, cancellationToken);

            return costingConfig;
        }

        private async Task SetEntityLinkages(CostingConfigSaveData costingConfigSaveData, CostingConfig costingConfig, CancellationToken cancellationToken)
        {
            var isEntityLevelSecurityEnabled = await _systemSettingRepository.GetBooleanSystemSettingByNameAsync(SystemSettingConstants.EntityLevelSecuritySystemSettingName, cancellationToken);

            if (isEntityLevelSecurityEnabled)
            {
                costingConfig.EntityLinkages = new List<CostingConfigEntityLinkage>();

                foreach (var glPayrollEntityId in costingConfigSaveData.GlPayrollEntityIds.Where(e => e != 0))
                {
                    var glPayrollEnitityLinkage = new CostingConfigEntityLinkage();
                    glPayrollEnitityLinkage.CostingConfigGuid = costingConfig.CostingConfigGuid;
                    glPayrollEnitityLinkage.EntityId = glPayrollEntityId;
                    glPayrollEnitityLinkage.IsUtilization = false;

                    costingConfig.EntityLinkages.Add(glPayrollEnitityLinkage);
                }

                if (costingConfig.IsUtilizationEntityConfigured)
                {
                    foreach (var utilizationEntityId in costingConfigSaveData.UtilizationEntityIds.Where(e => e != 0))
                    {
                        var utilizationEntityLinkage = new CostingConfigEntityLinkage();
                        utilizationEntityLinkage.CostingConfigGuid = costingConfig.CostingConfigGuid;
                        utilizationEntityLinkage.EntityId = utilizationEntityId;
                        utilizationEntityLinkage.IsUtilization = true;

                        costingConfig.EntityLinkages.Add(utilizationEntityLinkage);
                    }
                }
            }
        }
    }
}
