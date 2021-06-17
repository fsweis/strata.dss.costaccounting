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

        [HttpGet("entities")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<Entity>> GetEntities(CancellationToken cancellationToken)
        {
            var entities = await _entityService.GetEntities(cancellationToken);
            return entities;
        }
        [HttpGet("filtered-entities/{costingConfigGuid}")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<Entity>> GetFilteredEntities([FromRoute] Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            //get system setting for costing entity security
            var entities = await _entityService.GetFilteredEntities(costingConfigGuid, cancellationToken);
            return entities;
        }

        [HttpGet("costing-methods")]
        [ProducesResponseType(200)]
        public IEnumerable<ConfigCostingMethod> GetCostingMethods()
        {
            var methods = new List<ConfigCostingMethod> { ConfigCostingMethod.GetByMethod(CostingMethod.Simultaneous), ConfigCostingMethod.GetByMethod(CostingMethod.SingleStepDown) };
            return methods;
        }

        [HttpGet("costing-types")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<ConfigCostingType>> GetCostingTypes(CancellationToken cancellationToken)
        {
            var isClaimsCostingEnabled = await _systemSettingRepository.GetIsClaimsCostingEnabledAsync(cancellationToken);

            if (isClaimsCostingEnabled)
            {
                return new List<ConfigCostingType> { ConfigCostingType.GetByType(CostingType.PatientCare), ConfigCostingType.GetByType(CostingType.Claims) };
            }
            else
            {
                return new List<ConfigCostingType>();
            }
        }

        [HttpPost("")]
        [ProducesResponseType(200)]
        public async Task<CostConfigSaveResult> AddNewConfig([FromBody] CostingConfigSaveData costConfigSaveData, CancellationToken cancellationToken)
        {

            var saveResult = await _costingConfigService.AddNewConfigAsync(costConfigSaveData, cancellationToken);
            return saveResult;
        }

    }
}
