using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/date")]
    public class DateController : ControllerBase
    {
        private readonly ICostAccountingRepository _costAccountingRepository;
        public DateController(ICostAccountingRepository costAccountingRepository)
        {
            _costAccountingRepository = costAccountingRepository;
        }

        [HttpGet("fiscal-months")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<FiscalMonth>> GetFiscalMonths(CancellationToken cancellationToken)
        {
            var fiscalMonths = await _costAccountingRepository.GetFiscalMonthsAsync(cancellationToken);
            fiscalMonths = fiscalMonths.Where(x => x.FiscalMonthId != 0).OrderBy(x => x.SortOrder);
            return fiscalMonths;

        }

        [HttpGet("fiscal-years")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<FiscalYear>> GetFiscalYears(CancellationToken cancellationToken)
        {
            var fiscalYears = await _costAccountingRepository.GetFiscalYearsAsync(cancellationToken);
            fiscalYears = fiscalYears.Where(x => x.FiscalYearId != 0).OrderBy(x => x.Name);
            return fiscalYears;
        }
    }
}
