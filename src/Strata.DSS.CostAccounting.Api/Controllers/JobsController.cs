using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/[controller]")]
    public class JobsController : ControllerBase   
    {
        private readonly IBackgroundJobClient _backgroundJobClient;

        public JobsController(IBackgroundJobClient backgroundJobClient)
        {
            _backgroundJobClient = backgroundJobClient;
        }

        [HttpPost("")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        public IActionResult AddJob()
        {
            var jobId = _backgroundJobClient.Enqueue<CostAccountingJob>(job => job.RunCostAccountingJob());

            return Accepted(new {jobId});
        }
    }
}
