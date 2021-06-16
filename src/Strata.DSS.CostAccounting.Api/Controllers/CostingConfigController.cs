using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Strata.ApiLib.Standard.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Services;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using System.Linq;

namespace Strata.DSS.CostAccounting.Api.Controllers
{

    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/costing-configs")]
    public class CostingConfigController : ControllerBase
    {
        private readonly ICostingConfigRepository _costingConfigRepository;
        private readonly IEntityService _entityService;
        private readonly ICostingConfigService _costingConfigService;
        private readonly ISystemSettingRepository _systemSettingRepository;
        public CostingConfigController(ICostingConfigRepository costingConfigRepository, IEntityService entityService, ICostingConfigService costingConfigService, ISystemSettingRepository systemSettingRepository)
        {
            _costingConfigRepository = costingConfigRepository;
            _entityService = entityService;
            _costingConfigService = costingConfigService;
            _systemSettingRepository = systemSettingRepository;
        }

        [HttpGet("")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<CostingConfigModel>> GetAllCostingConfigs(CancellationToken cancellationToken)
        {
            var costingConfigs = await _costingConfigRepository.GetAllCostingConfigsAsync(cancellationToken);
            return costingConfigs;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        public async Task<CostingConfigModel> GetCostingConfig([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(id, cancellationToken);
            return costingConfig;
        }

        [HttpGet("fiscal-months")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<FiscalMonth>> GetFiscalMonths(CancellationToken cancellationToken)
        {
            var fiscalMonths = await _costingConfigRepository.GetFiscalMonthsAsync(cancellationToken);
            fiscalMonths = fiscalMonths.Where(x => x.FiscalMonthId != 0).OrderBy(x => x.SortOrder);
            return fiscalMonths;

        }


        [HttpGet("fiscal-years")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<FiscalYear>> GetFiscalYears(CancellationToken cancellationToken)
        {
            var fiscalYears = await _costingConfigRepository.GetFiscalYearsAsync(cancellationToken);
            fiscalYears = fiscalYears.Where(x => x.FiscalYearId != 0).OrderBy(x => x.Name);
            return fiscalYears;

        }

        [HttpGet("entities")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<Entity>> GetEntities(CancellationToken cancellationToken)
        {
            var entities = await _entityService.GetEntities();
            return entities;
        }
        [HttpGet("filtered-entities")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<Entity>> GetFilteredEntities(CancellationToken cancellationToken)
        {
            //get system setting for costing entity security
            var isCostingEntityLevelSecurityEnabled = await _systemSettingRepository.GetIsCostingEntityLevelSecurityEnabledAsync(default);
            var entities = await _entityService.GetFilteredEntities(null, isCostingEntityLevelSecurityEnabled);
            return entities;
        }

        [HttpGet("costing-methods")]
        [ProducesResponseType(200)]
        public IEnumerable<ConfigCostingMethod> GetCostingMethods(CancellationToken cancellationToken)
        {
            var methods = new List<ConfigCostingMethod> { ConfigCostingMethod.LoadByMethod(CostingMethod.Simultaneous), ConfigCostingMethod.LoadByMethod(CostingMethod.SingleStepDown) };
            return methods;
        }

        [HttpGet("costing-types")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<ConfigCostingType>> GetCostingTypes(CancellationToken cancellationToken)
        {
            var isClaimsCostingEnabled = await _systemSettingRepository.GetIsClaimsCostingEnabledAsync(default);

            if (isClaimsCostingEnabled)
            {
                return new List<ConfigCostingType> { ConfigCostingType.LoadByType(CostingType.PatientCare), ConfigCostingType.LoadByType(CostingType.Claims) };
            }
            else
            {
                return new List<ConfigCostingType>();
            }
        }

        [HttpGet("costing-permissions")]
        [ProducesResponseType(200)]
        public async Task<CostingPermissions> GetCostingPermissions(CancellationToken cancellationToken)
        {
            
            var isClaimsCostingEnabled = await _systemSettingRepository.GetIsClaimsCostingEnabledAsync(default);
            var isCostingEntityLevelSecurityEnabled = await _systemSettingRepository.GetIsCostingEntityLevelSecurityEnabledAsync(default);
            return new CostingPermissions { IsClaimsCostingEnabled = isClaimsCostingEnabled, IsCostingEntityLevelSecurityEnabled = isCostingEntityLevelSecurityEnabled };
        }


        [HttpPost("")]
        [ProducesResponseType(200)]
        public async Task<CostConfigSaveResult> AddNewConfig([FromBody] CostingConfigSaveData costConfigSaveData, CancellationToken cancellationToken)
        {

            var saveResult = await _costingConfigService.AddNewConfigAsync(costConfigSaveData);
            return saveResult;
        }

    }
}
