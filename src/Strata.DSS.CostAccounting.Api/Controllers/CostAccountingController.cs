using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/[controller]")]
    public class CostAccountingController : ControllerBase
    {
        private readonly ICostAccountingRepository _costaccountingRepository;

        public CostAccountingController(ICostAccountingRepository costaccountingRepository)
        {
            _costaccountingRepository = costaccountingRepository;
        }

        [HttpGet("")]
		[ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<CostAccountingModel>>> GetAllCostAccountings(CancellationToken cancellationToken)
        {
            var costaccountings = await _costaccountingRepository.GetAllCostAccountingsAsync(cancellationToken);
            return Ok(costaccountings);
        }

        [HttpGet("{id}")]
		[ProducesResponseType(200)]
        public async Task<ActionResult<CostAccountingModel>> GetCostAccounting([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var costaccounting = await _costaccountingRepository.GetCostAccountingAsync(id, cancellationToken);

            return costaccounting;

        }

    }
}