using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Entities
{
    public class CostingResultEntity
    {
        public int CostingResultID { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public bool IsDraft { get; set; }
        public bool IsMarkedForDeletion { get; set; }
        public CostingConfigEntity CostingConfig { get; set; }
    }
}
