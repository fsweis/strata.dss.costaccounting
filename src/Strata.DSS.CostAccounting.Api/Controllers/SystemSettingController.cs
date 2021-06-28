using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/system-setting")]
    public class SystemSettingController : ControllerBase
    {
        private readonly ISystemSettingRepository _systemSettingRepository;
        public SystemSettingController(ISystemSettingRepository systemSettingRepository)
        {
            _systemSettingRepository = systemSettingRepository;
        }

        [HttpGet("claims")]
        [ProducesResponseType(200)]
        public async Task<bool> GetIsClaimsCostingEnabled(CancellationToken cancellationToken)
        {
            return await _systemSettingRepository.GetIsClaimsCostingEnabledAsync(cancellationToken);
        }

        [HttpGet("entity-security")]
        [ProducesResponseType(200)]
        public async Task<bool> GetIsCostingEntityLevelSecurityEnabled(CancellationToken cancellationToken)
        {
            return await _systemSettingRepository.GetIsCostingEntityLevelSecurityEnabledAsync(cancellationToken);
        }

        [HttpGet("fiscal-year")]
        [ProducesResponseType(200)]
        public async Task<int> GetCurrentFiscalYear(CancellationToken cancellationToken)
        {
            return await _systemSettingRepository.GetCurrentFiscalYearAsync(cancellationToken);
        }
    }
}