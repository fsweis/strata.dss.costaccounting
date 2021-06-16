﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Strata.ApiLib.Standard.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Services;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;

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
        public CostingConfigController(ICostingConfigRepository costingConfigRepository, IEntityService entityService, ICostingConfigService costingConfigService)
        {
            _costingConfigRepository = costingConfigRepository;
            _entityService = entityService;
            _costingConfigService = costingConfigService;
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

        [HttpGet("fiscal-months")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<FiscalMonth>>> GetFiscalMonths(CancellationToken cancellationToken)
        {
            var fiscalMonths = await _costingConfigRepository.GetFiscalMonthsAsync(cancellationToken);
            fiscalMonths = fiscalMonths.Where(x => x.FiscalMonthID != 0).OrderBy(x => x.SortOrder);
            return Ok(fiscalMonths);

        }


        [HttpGet("fiscal-years")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<FiscalYear>>> GetFiscalYears(CancellationToken cancellationToken)
        {
            var fiscalYears = await _costingConfigRepository.GetFiscalYearsAsync(cancellationToken);
            fiscalYears = fiscalYears.Where(x => x.FiscalYearID != 0).OrderBy(x => x.Name);
            return Ok(fiscalYears);

        }

        [HttpGet("entities")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<Entity>>> GetEntities(CancellationToken cancellationToken)
        {
            var entities = await _entityService.GetEntities();
            return Ok(entities);
        }
        [HttpGet("filtered-entities")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<Entity>>> GetFilteredEntities(CancellationToken cancellationToken)
        {
            //get system setting for costing entity security
            var systemSettings = await _costingConfigRepository.GetSystemSettingsAsync(cancellationToken);
            var isCostingEntityLevelSecurityEnabled = systemSettings.Any(x => x.IsCostingEntityLevelSecurityEnabled());
            var entities = await _entityService.GetFilteredEntities(null, isCostingEntityLevelSecurityEnabled);
            return Ok(entities);
        }

        [HttpGet("costing-methods")]
        [ProducesResponseType(200)]
        public ActionResult<IEnumerable<ConfigCostingMethod>> GetCostingMethods(CancellationToken cancellationToken)
        {
            var methods = new List<ConfigCostingMethod> { ConfigCostingMethod.LoadByMethod(CostingMethod.Simultaneous), ConfigCostingMethod.LoadByMethod(CostingMethod.SingleStepDown) };
            return Ok(methods);
        }

        [HttpGet("costing-types")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<ConfigCostingType>>> GetCostingTypes(CancellationToken cancellationToken)
        {
            var systemSettings = await _costingConfigRepository.GetSystemSettingsAsync(cancellationToken);
            var isClaimsCostingEnabled = systemSettings.Any(x => x.IsClaimsCostingEnabled());

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
        public async Task<ActionResult<CostingPermissions>> GetCostingPermissions(CancellationToken cancellationToken)
        {
            var systemSettings = await _costingConfigRepository.GetSystemSettingsAsync(cancellationToken);
            var isClaimsCostingEnabled = systemSettings.Any(x => x.IsClaimsCostingEnabled());
            var isCostingEntityLevelSecurityEnabled = systemSettings.Any(x => x.IsCostingEntityLevelSecurityEnabled());
            return new CostingPermissions { IsClaimsCostingEnabled = isClaimsCostingEnabled, IsCostingEntityLevelSecurityEnabled = isCostingEntityLevelSecurityEnabled };
        }


        [HttpPost("")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<CostConfigSaveResult>> AddNewConfig([FromBody] CostingConfigSaveData costConfigSaveData, CancellationToken cancellationToken)
        {

            var saveResult = await _costingConfigService.AddNewConfigAsync(costConfigSaveData);
            return Ok(saveResult);
        }

    }
}
