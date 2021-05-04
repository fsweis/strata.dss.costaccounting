using System;

namespace Strata.DSS.CostAccounting.Api.Dtos
{
	public class UserDto
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
        public Guid UserGuid { get; set; }
	}
}
