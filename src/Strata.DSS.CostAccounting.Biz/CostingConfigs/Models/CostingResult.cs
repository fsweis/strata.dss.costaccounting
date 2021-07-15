using System;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class CostingResult
    {
        public Guid CostingConfigGuid { get; set; }
        public int CostingResultId { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public bool IsDraft { get; set; }
        public bool IsMarkedForDeletion { get; set; }
    }
}
