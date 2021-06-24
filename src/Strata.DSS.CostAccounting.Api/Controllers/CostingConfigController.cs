using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Api.DTOs;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Services;
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
        private readonly ICostAccountingRepository _costAccountingRepository;
        private readonly ICostingConfigService _costingConfigService;
        private readonly ISystemSettingRepository _systemSettingRepository;
        public CostingConfigController(ICostingConfigRepository costingConfigRepository, ICostAccountingRepository costAccountingRepository, ICostingConfigService costingConfigService, ISystemSettingRepository systemSettingRepository)
        {
            _costingConfigRepository = costingConfigRepository;
            _costAccountingRepository = costAccountingRepository;
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

        [HttpGet("copy/{id}")]//TODO: better naming potentially?
        [ProducesResponseType(200)]
        public async Task<ActionResult<CostingConfigDto>> GetCostingConfigForCopy([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(id, cancellationToken);
            var entityLinkages = await _costingConfigRepository.GetCostingConfigEntityLinkagesAsync(id, cancellationToken);

            var dto = new CostingConfigDto(costingConfig)
            {
                GlPayrollEntities = entityLinkages.Where(x => !x.IsUtilization).Select(x => x.EntityId.ToString()).ToList(),
                UtilEntities = entityLinkages.Where(x => x.IsUtilization).Select(x => x.EntityId.ToString()).ToList()
            };

            return dto;
        }

        [HttpPost("")]
        [ProducesResponseType(200)]
        public async Task<CostingConfigModel> AddNewConfig([FromBody] CostingConfigSaveData costConfigSaveData, CancellationToken cancellationToken)
        {
            var costConfig = await _costingConfigService.AddNewConfigAsync(costConfigSaveData, cancellationToken);
            return costConfig;
        }

        [HttpDelete("{costingConfigGuid}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<Guid>> DeleteCostingConfig([FromRoute] Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var jobGuid = await _costingConfigRepository.DeleteCostingConfigAsync(costingConfigGuid, cancellationToken);
            return Ok(jobGuid);
        }

        [HttpGet("entities")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<Entity>> GetEntities(CancellationToken cancellationToken)
        {
            var entities = await _costAccountingRepository.GetEntitiesAsync(cancellationToken);
            return entities;
        }

        [HttpGet("filtered-entities/{costingConfigGuid}")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<Entity>> GetFilteredEntities([FromRoute] Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var isCostingEntityLevelSecurityEnabled = await _systemSettingRepository.GetIsCostingEntityLevelSecurityEnabledAsync(cancellationToken);

            var entities = await _costAccountingRepository.GetEntitiesAsync(cancellationToken);
            
            if (isCostingEntityLevelSecurityEnabled)
            {
                if (costingConfigGuid != null && costingConfigGuid != Guid.Empty)
                {
                    var filteredEntities = await _costingConfigRepository.GetCostingConfigEntityLevelSecuritiesAsync(costingConfigGuid, cancellationToken);
                    if(filteredEntities.Count()>0)
                    {
                        return entities.Where(x => filteredEntities.Any(y => y.EntityId == x.EntityId)).ToList();
                    }
                    
                }
                return new List<Entity>();
            }

            return entities;
        }
    }
}
