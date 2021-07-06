using System;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class CostingResult
    {
        public int CostingResultID { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public bool IsDraft { get; set; }
        public bool IsMarkedForDeletion { get; set; }
    }
}
