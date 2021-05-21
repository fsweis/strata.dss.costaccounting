using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Constants
{
    public static class MeasureConstants
    {
        public const string PES_EncounterRecordNumber_ColumnName = "EncounterRecordNumber";
        public const string UnitsOfServiceMeasure = "UnitsOfService";
        #region Payroll
        public const string YTDHoursMeasure = "YTDHours";
        public const string YTDDollarsMeasure = "YTDDollars";
        #endregion
        #region Claims
        public const string PCS_ClaimRecordNumber_ColumnName = "ClaimRecordNumber";
        #endregion
    }
}
