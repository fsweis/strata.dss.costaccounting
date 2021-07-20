using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/department-categorization")]
    public class DepartmentCategorizationController : ControllerBase
    {
        private readonly IDepartmentCategorizationRepository _departmentCategorizationRepository;

        public DepartmentCategorizationController(IDepartmentCategorizationRepository departmentCategorizationRepository)
        {
            _departmentCategorizationRepository = departmentCategorizationRepository;
        }

        [HttpGet("departments")]
        [ProducesResponseType(200)]
        public IEnumerable<Department> GetDepartments(CancellationToken cancellationToken)
        {
            var departments = _departmentCategorizationRepository.GetDepartments(cancellationToken);

            return departments;
        }

        [HttpGet("{searchTerm}/search")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public IEnumerable<Department> GetDepartmentsBySearchTerm([FromRoute] string searchTerm, CancellationToken cancellationToken)
        {
            var departments = _departmentCategorizationRepository.GetDepartmentsBySearch(searchTerm, cancellationToken);

            return departments;
        }

        [HttpGet("{costingConfigGuid}/exceptions")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public ActionResult<IEnumerable<CostingDepartmentException>> GetExceptions([FromRoute] Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var exceptions = _departmentCategorizationRepository.GetDepartmentExceptions(costingConfigGuid, cancellationToken);
            if(!exceptions.Any())
            {
                return NotFound();
            }

            return Ok(exceptions);
        }
    }
}
