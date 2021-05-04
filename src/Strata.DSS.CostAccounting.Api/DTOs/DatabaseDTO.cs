using System;

namespace Strata.DSS.CostAccounting.Api.Dtos
{
	public class DatabaseDto
	{
		public string DatabaseName { get; set; }
		public Guid DatabaseGuid { get; set; }
		public bool IsClientDb { get; set; }
	}
}
