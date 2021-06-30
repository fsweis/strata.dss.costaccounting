using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Services;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/costing-configs")]
    public class CostingConfigController : ControllerBase
    {
        private readonly ICostingConfigService _costingConfigService;
        private readonly ICostingConfigRepository _costingConfigRepository;
        private readonly ICostAccountingRepository _costAccountingRepository;

        public CostingConfigController(ICostingConfigService costingConfigService, ICostingConfigRepository costingConfigRepository, ICostAccountingRepository costAccountingRepository)
        {
            _costingConfigService = costingConfigService;
            _costingConfigRepository = costingConfigRepository;
            _costAccountingRepository = costAccountingRepository;
        }

        [HttpGet("")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<CostingConfig>> GetAllCostingConfigs(CancellationToken cancellationToken)
        {
            var costingConfigs = await _costingConfigRepository.GetAllCostingConfigsAsync(cancellationToken);
            return costingConfigs;
        }

        [HttpGet("{costingConfigGuid}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<CostingConfig>> GetCostingConfig([FromRoute] Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(costingConfigGuid, cancellationToken);
            if (costingConfig == null)
            {
                return NotFound();
            }
            return costingConfig;
        }

        [HttpGet("{costingConfigGuid}/entity-linkages")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<CostingConfigEntityLinkage>> GetCostingConfigEntityLinkages([FromRoute] Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var entities = await _costingConfigRepository.GetCostingConfigEntityLinkagesAsync(costingConfigGuid, cancellationToken);
            return entities;
        }

        [HttpPost("")]
        [ProducesResponseType(200)]
        public async Task<CostingConfig> AddNewConfig([FromBody] CostingConfigSaveData costingConfigSaveData, CancellationToken cancellationToken)
        {
            var costingConfig = await _costingConfigService.AddNewCostingConfigAsync(costingConfigSaveData, cancellationToken);
            return costingConfig;
        }

        [HttpDelete("{costingConfigGuid}")]
        [ProducesResponseType(200)]
        public async Task<Guid> DeleteCostingConfig([FromRoute] Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var jobGuid = await _costingConfigRepository.DeleteCostingConfigAsync(costingConfigGuid, cancellationToken);
            return jobGuid;
        }

        [HttpGet("entities")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<Entity>> GetEntities(CancellationToken cancellationToken)
        {
            var entities = await _costAccountingRepository.GetEntitiesAsync(cancellationToken);
            return entities;
        }

        [HttpGet("{costingConfigGuid}/filtered-entities")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<Entity>> GetFilteredEntities([FromRoute] Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var filteredEntities = await _costingConfigRepository.GetFilteredEntitiesAsync(costingConfigGuid, cancellationToken);
            return filteredEntities;
        }
    }
}
