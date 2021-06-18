using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Api.DTOs;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Services;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

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
        public async Task<ActionResult<IEnumerable<CostingConfigDto>>> GetAllCostingConfigs(CancellationToken cancellationToken)
        {
            var costingConfigs = await _costingConfigRepository.GetAllCostingConfigsAsync(cancellationToken);
            var dtos = costingConfigs.Select(x => new CostingConfigDto(x)).ToList();
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<CostingConfigDto>> GetCostingConfig([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(id, cancellationToken);
            return Ok(new CostingConfigDto(costingConfig));
        }

        [HttpGet("copy/{id}")]//better naming potentially?
        [ProducesResponseType(200)]
        public async Task<ActionResult<CostingConfigDto>> GetCostingConfigForCopy([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(id, cancellationToken);
            var entityLinkages = await _costingConfigRepository.GetCostingConfigEntityLinkagesAsync(id, cancellationToken);

            var dto = new CostingConfigDto(costingConfig)
            {
                GlPayrollEntities = entityLinkages.Where(x => x.IsUtilization == false).Select(x => x.EntityId).ToList(),
                UtilEntities = entityLinkages.Where(x => x.IsUtilization == true).Select(x => x.EntityId).ToList()
            };

            return Ok(new CostingConfigDto(costingConfig));
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
            var isCostingEntityLevelSecurityEnabled = await _systemSettingRepository.GetIsCostingEntityLevelSecurityEnabledAsync(cancellationToken);

            var entities = await _entityService.GetFilteredEntities(costingConfigGuid, isCostingEntityLevelSecurityEnabled, cancellationToken);
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

        [HttpDelete("{costingConfigId}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<Guid>> DeleteCostingConfig([FromRoute] Guid costingConfigId, CancellationToken cancellationToken)
        {
            var jobGuid = await _costingConfigRepository.DeleteCostingConfigAsync(costingConfigId, cancellationToken);
            return Ok(jobGuid);
        }
    }
}
