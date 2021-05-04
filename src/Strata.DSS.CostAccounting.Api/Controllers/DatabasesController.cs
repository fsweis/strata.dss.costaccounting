using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strata.DSS.CostAccounting.Api.Dtos;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/[controller]")]
    public class DatabasesController : ControllerBase
    {
        [HttpGet("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<DatabaseDto>> GetDatabases()
        {
            var databases = new List<DatabaseDto>(){
                new DatabaseDto()
                {
                    DatabaseName = "Test DB1",
                    IsClientDb = false,
                    DatabaseGuid = Guid.NewGuid()
                },
                new DatabaseDto()
                {
                    DatabaseName = "Test DB2",
                    IsClientDb = false,
                    DatabaseGuid = Guid.NewGuid()
                },
                new DatabaseDto()
                {
                    DatabaseName = "Client Test DB1",
                    IsClientDb = true,
                    DatabaseGuid = Guid.NewGuid()
                },
                new DatabaseDto()
                {
                    DatabaseName = "Client Test DB2",
                    IsClientDb = true,
                    DatabaseGuid = Guid.NewGuid()
                }
            };
            return databases;
        }
    }
}
