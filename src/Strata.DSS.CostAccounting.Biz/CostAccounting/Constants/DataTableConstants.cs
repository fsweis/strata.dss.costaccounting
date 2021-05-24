using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Constants
{
    public static class DataTableConstants
    {
        #region DSS
        public const string DSSGL = "DSS GL Sampled";
        public const string PatientBillingLineItemDetail = "DSS Patient Billing Line Item Detail";
        public const string PatientEncounterSummary = "DSS Patient Encounter";
        public const string StatisticDriver = "DSS Statistic Driver";
        public const string CostingStatisticDriver = "DSS Costing Statistic Driver";
        public const string PayrollSampled = "DSS Payroll Sampled";
        #region Claims
        public const string PatientClaimChargeLineItemDetail = "DSS Patient Claim Charge Detail";
        public const string PatientClaimSummary = "DSS Patient Claim Summary";
        public const string PatientClaimsCostDetail = "DSS Patient Claims Cost Detail";
        public const string ClaimCostingStatisticDriver = "DSS Claim Costing Statistic Driver"; //ClaimCostingStatisticDriver table is output of processing claim detail level stats
        public const string ClaimStatisticDriver = "DSS Claim Statistic Driver"; //FactClaimStatisticDriver table that is imported into
        #endregion
        #endregion
    }
}