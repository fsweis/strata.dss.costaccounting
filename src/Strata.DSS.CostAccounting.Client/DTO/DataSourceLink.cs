using System;

namespace Strata.DSS.CostAccounting.Client.DTO
{
    public class DataSourceLink
    {
        public Guid MeasureGuid { get; set; }
        public Guid DataTableGuid { get; set; }
        public string FriendlyName { get; set; }
        public bool IsFirstSelect { get; set; }
    }
}