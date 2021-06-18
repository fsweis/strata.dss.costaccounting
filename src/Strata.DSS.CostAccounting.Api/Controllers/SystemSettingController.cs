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
    [Route("api/v{api-version:apiVersion}/system-setting")]
    public class SystemSettingController: ControllerBase
    {
        private readonly ISystemSettingRepository _systemSettingRepository;
        public SystemSettingController(ISystemSettingRepository systemSettingRepository)
        {
            _systemSettingRepository = systemSettingRepository;
        }

        [HttpGet("claims")]
        [ProducesResponseType(200)]
        public async Task<Boolean> GetIsClaimsCostingEnabled(CancellationToken cancellationToken)
        {
            return await _systemSettingRepository.GetIsClaimsCostingEnabledAsync(cancellationToken);
        }

        [HttpGet("entity-security")]
        [ProducesResponseType(200)]
        public async Task<Boolean> GetIsCostingEntityLevelSecurityEnabled(CancellationToken cancellationToken)
        {
            return await _systemSettingRepository.GetIsCostingEntityLevelSecurityEnabledAsync(cancellationToken);
        }
        [HttpGet("fiscal-year")]
        [ProducesResponseType(200)]
        public async Task<Int32> GetCurrentFiscalYear(CancellationToken cancellationToken)
        {
            return await _systemSettingRepository.GetCurrentFiscalYearAsync(cancellationToken);
        }
    }
}

