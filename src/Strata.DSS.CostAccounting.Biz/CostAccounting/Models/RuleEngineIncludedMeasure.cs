using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class RuleEngineIncludedMeasure
    {
        public Guid RuleEngineIncludedMeasureGUID { get; set; }
        public Guid DataTableGUID { get; set; }
        public Guid MeasureGUID { get; set; }
        public string DataTableName { get; set; }
        public string MeasureName { get; set; }
        public bool IsIncludedInRules { get; set; }
        public bool IsIncludedInSchedules { get; set; }
        public bool IsIncludedInAdHocPatientPopulations { get; set; }
        public bool IsIncludedInActions { get; set; }
    }
}

