﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult<IEnumerable<CostingConfigModel>>> GetAllCostingConfigs(CancellationToken cancellationToken)
        {
            var costingConfigs = await _costingConfigRepository.GetAllCostingConfigsAsync(cancellationToken);
            return Ok(costingConfigs);
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

        [HttpGet("fiscal-month")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<FiscalMonth>>> GetFiscalMonths(CancellationToken cancellationToken)
        {
            var fiscalMonths = _costingConfigRepository.GetFiscalMonthsAsync(cancellationToken);
            return Ok(fiscalMonths);

        }


        [HttpGet("fiscal-year")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<FiscalYear>>> GetFiscalYears(CancellationToken cancellationToken)
        {
            var fiscalYears = _costingConfigRepository.GetFiscalYearsAsync(cancellationToken);
            return Ok(fiscalYears);

        }

    }
}
