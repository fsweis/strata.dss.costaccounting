﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("{costingConfigGuid}/filtered-departments/{departmentType}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public ActionResult<IEnumerable<CostingDepartmentException>> GetFiltered([FromRoute] Guid costingConfigGuid, [FromRoute] string departmentType, CancellationToken cancellationToken)
        {
            if (!departmentExceptionFilterValues.Contains(departmentType.ToLower()))
            {
                return BadRequest("Invalid Department Filter: "+departmentType);
            }

            var filteredDepartments = _departmentCategorizationService.GetDepartmentByType(costingConfigGuid, departmentType,cancellationToken);
            if (!filteredDepartments.Any())
            {
                return NotFound();
            }

            return Ok(filteredDepartments);
        }
    }
}
