using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Api.DTOs;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
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

        public CostingConfigController(ICostingConfigRepository costingConfigRepository)
        {
            _costingConfigRepository = costingConfigRepository;
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
        public async Task<ActionResult<CostingConfigModel>> GetCostingConfig([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var costingConfig = await _costingConfigRepository.GetCostingConfigAsync(id, cancellationToken);
            return costingConfig;
        }

        [HttpPost]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<CostingConfigModel>>> SaveStatisticDrivers([FromBody] CostingConfigModel costingConfgData
                                                                                                , CancellationToken cancellationToken)
        {
            return Ok();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<CostingConfigModel>>> DeleteCostingConfig([FromBody] Guid costingConfigId, CancellationToken cancellationToken)
        {
            var jobGuid = await _costingConfigRepository.DeleteCostingConfigAsync(costingConfigId, cancellationToken);
            return Ok(jobGuid);
        }
    }
}
