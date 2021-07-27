using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Enums;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Repositories;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Services;
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
        private readonly IDepartmentCategorizationService _departmentCategorizationService;
        private readonly string[] departmentExceptionFilterValues = { "revenue", "overhead" };
        public DepartmentCategorizationController(IDepartmentCategorizationRepository departmentCategorizationRepository, IDepartmentCategorizationService departmentCategorizationService)
        {
            _departmentCategorizationRepository = departmentCategorizationRepository;
            _departmentCategorizationService = departmentCategorizationService;
        }

        [HttpGet("departments")]
        [ProducesResponseType(200)]
        public IEnumerable<Department> GetDepartments(CancellationToken cancellationToken)
        {
            var departments = _departmentCategorizationRepository.GetDepartments(cancellationToken);

            return departments;
        }

        [HttpGet("search/{searchTerm}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public IEnumerable<Department> GetDepartmentsBySearchTerm([FromRoute] string searchTerm, CancellationToken cancellationToken)
        {
            var departments = _departmentCategorizationRepository.GetDepartmentsBySearch(searchTerm, cancellationToken);

            return departments;
        }

        [HttpGet("{costingConfigGuid}/exceptions")]
        [ProducesResponseType(200)]
        public ActionResult<IEnumerable<CostingDepartmentException>> GetExceptions([FromRoute] Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var exceptions = _departmentCategorizationRepository.GetDepartmentExceptions(costingConfigGuid, cancellationToken);
            return Ok(exceptions);
        }

        [HttpGet("{costingConfigGuid}/filtered-departments/{departmentType}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public ActionResult<IEnumerable<CostingDepartmentException>> GetFiltered([FromRoute] Guid costingConfigGuid, [FromRoute] string departmentType, CancellationToken cancellationToken)
        {      
            var filteredDepartments = _departmentCategorizationService.GetDepartmentByType(costingConfigGuid, departmentType,cancellationToken);
            if (!filteredDepartments.Any())
            {
                return NotFound();
            }

            return Ok(filteredDepartments);
        }

        [HttpPost("")]
        [ProducesResponseType(200)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<CostingDepartmentTypeException>>> SaveDepartmentExceptionData([FromBody] CostingDepartmentTypeExceptionSaveData departmentExceptionsData, CancellationToken cancellationToken)
        {
            try
            {
                if (departmentExceptionsData.Updated.Any())
                    await _departmentCategorizationRepository.AddOrUpdateDepartmentException(departmentExceptionsData.Updated, cancellationToken);
                if (departmentExceptionsData.DeletedIds.Any())
                    await _departmentCategorizationRepository.DeleteDepartmentExceptions(departmentExceptionsData.CostingConfigGuid, departmentExceptionsData.DeletedIds, cancellationToken);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(_departmentCategorizationRepository.GetDepartmentExceptions(departmentExceptionsData.CostingConfigGuid, cancellationToken));
        }

    }
}
