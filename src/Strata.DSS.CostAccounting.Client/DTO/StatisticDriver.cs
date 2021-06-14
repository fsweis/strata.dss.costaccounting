using System;

namespace Strata.DSS.CostAccounting.Client.DTO
{
    public class StatisticDriver
    {
        public Guid DriverConfigGuid { get; set; }
        public Guid MeasureGuid { get; set; }
        public Guid DataTableGuid { get; set; }
        public string Name { get; set; }
        public bool HasRules { get; set; }
        public bool IsInverted { get; set; }
        public bool IsUsed { get; set; }
        public CostingType CostingType { get; set; }
    }
}
