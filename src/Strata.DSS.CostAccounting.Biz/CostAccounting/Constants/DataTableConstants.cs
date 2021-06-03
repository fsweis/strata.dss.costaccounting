using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Constants
{
    public static class DataTableConstants
    {
        #region GlobalIDs
        public const string DSSGL = "DSS GL Sampled";
        public const string PatientBillingLineItemDetail = "DSS Patient Billing Line Item Detail";
        public const string PatientEncounterSummary = "DSS Patient Encounter";
        public const string StatisticDriver = "DSS Statistic Driver";
        public const string CostingStatisticDriver = "DSS Costing Statistic Driver";
        public const string PayrollSampled = "DSS Payroll Sampled";
        //Claims
        public const string PatientClaimChargeLineItemDetail = "DSS Patient Claim Charge Detail";
        public const string PatientClaimSummary = "DSS Patient Claim Summary";
        public const string PatientClaimsCostDetail = "DSS Patient Claims Cost Detail";
        public const string ClaimCostingStatisticDriver = "DSS Claim Costing Statistic Driver"; //ClaimCostingStatisticDriver table is output of processing claim detail level stats
        public const string ClaimStatisticDriver = "DSS Claim Statistic Driver"; //FactClaimStatisticDriver table that is imported into
        #endregion

        #region Well Known Datatable Guids
        public static readonly Guid DSSGLGuid = new Guid("64c5dbd4-2df8-49cd-9aa5-85c6948c1703");
        public static readonly Guid PatientBillingLineItemDetailGuid = new Guid("ea0cdbd2-fcf0-4a75-b08c-83b0709aea66");
        public static readonly Guid PatientEncounterSummaryGuid = new Guid("41639c8f-fecf-4449-b6e6-53f796c0c3e4");
        public static readonly Guid StatisticDriverGuid = new Guid("13139cd1-af0e-4560-97c8-e42e3d0a7d73");
        public static readonly Guid CostingStatisticDriverGuid = new Guid("d17f72f4-06cc-4f3c-9c61-e14712a25b62");
        public static readonly Guid PayrollSampledGuid = new Guid("245d1a99-d284-4f35-b891-6d8afb78d085");
        //Claims
        public static readonly Guid PatientClaimChargeLineItemDetailGuid = new Guid("c6512143-8160-444a-b8ce-e8a0c5a1e6d0");
        public static readonly Guid PatientClaimSummaryGuid = new Guid("d61d9dc7-d763-4c53-ade4-7a11bfda43db");
        public static readonly Guid ClaimCostingStatisticDriverGuid = new Guid("59f85731-f453-45ac-8f1f-dd959f779689");
        public static readonly Guid ClaimStatisticDriverGuid = new Guid("62fd1b49-21d1-4cdd-aed7-6635b2c25c4f");
        #endregion
    }
}