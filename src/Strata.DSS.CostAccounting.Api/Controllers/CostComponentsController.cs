
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.Exceptions;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.CostComponents.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Strata.DSS.CostAccounting.Biz.CostComponents.Models;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/cost-components")]
    public class CostComponentsController : ControllerBase
    {
        private readonly ICostComponentsRepository _costComponentsRepository;

        public CostComponentsController(ICostComponentsRepository costComponentsRepository)
        {
            _costComponentsRepository = costComponentsRepository;
        }

        [HttpGet("rollups")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<CostComponentRollup>> GetCostComponentRollups(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            IEnumerable<CostComponentRollup> costComponentRollups;
            try
            {
                costComponentRollups = await _costComponentsRepository.GetCostComponentRollupsAsync(costingConfigGuid, cancellationToken);
            }
            catch (Exception e)
            {
                throw new ApiException("Error calling GetCostComponentRollups", e);
            }

            return costComponentRollups;
        }

        [HttpPost("rollups")]
        [ProducesResponseType(200)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<CostComponentRollup>>> SaveCostComponentRollups([FromBody] CostComponentRollupSaveData costComponentRollupSaveData, CancellationToken cancellationToken)
        {
            if (costComponentRollupSaveData.Updated.Any())
            {
                await _costComponentsRepository.UpdateCostComponentRollupsAsync(costComponentRollupSaveData.Updated, cancellationToken);
            }

            if (costComponentRollupSaveData.DeletedGuids.Any())
            {
                await _costComponentsRepository.DeleteCostComponentRollupsAsync(costComponentRollupSaveData.DeletedGuids, cancellationToken);
            }

            var costComponentRollups = await _costComponentsRepository.GetCostComponentRollupsAsync(costComponentRollupSaveData.CostingConfigGuid, cancellationToken);

            return Ok(costComponentRollups);
        }
    }
}