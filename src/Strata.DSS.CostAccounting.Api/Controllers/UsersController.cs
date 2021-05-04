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
    public class UsersController : ControllerBase
    {
        [HttpGet("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<UserDto>> GetUsers()
        {
            var users = new List<UserDto>(){
                new UserDto()
                {
                    FirstName = "Carmen",
                    LastName = "Bello",
                    UserGuid = Guid.NewGuid()
                },
                new UserDto()
                {
                    FirstName = "Mitch",
                    LastName = "Leitch",
                    UserGuid = Guid.NewGuid()
                },
                new UserDto()
                {
                    FirstName = "Jacky",
                    LastName = "Chau",
                    UserGuid = Guid.NewGuid()
                },
                new UserDto()
                {
                    FirstName = "Alex",
                    LastName = "Wolek",
                    UserGuid = Guid.NewGuid()
                },
                new UserDto()
                {
                    FirstName = "James",
                    LastName = "Rapp",
                    UserGuid = Guid.NewGuid()
                }
            };
            return users;
        }
    }
}
