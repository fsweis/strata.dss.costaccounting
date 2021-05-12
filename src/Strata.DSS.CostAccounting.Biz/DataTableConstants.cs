using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz
{
    public static class DataTableConstants
    {
        #region DSS

        public const string CostingAudit = "DSS Costing Audit Report";
        public const string ClaimsCostingAudit = "DSS Claims Costing Audit Report";
        public const string CostingBLID = "DSS Costing PBLID";
        public const string CostingOut = "DSS Costing Out";
        public const string DriverReference = "DSS Driver Reference";
        public const string DSSGL = "DSS GL Sampled";
        public const string OverheadAllocationAudit = "DSS Overhead Allocation Audit";
        public const string PatientBillingLineItemDetail = "DSS Patient Billing Line Item Detail";
        public const string PatientContractsBillingSummary = "DSS Patient Contracts Billing Summary";
        public const string APCDetail = "DSS Patient APC Detail";
        public const string PatientEncounterCostDetail = "DSS Patient Encounter Cost Detail";
        public const string PatientEncounterSummary = "DSS Patient Encounter";
        public const string PatientEncounterSummaryForGrouper = "DSS Encounter Summary For Grouper";
        public const string SourceGLReclass = "DSS Source GL Reclass";
        public const string SourcePayrollReclass = "DSS Source Payroll Reclass";
        public const string SourceStatisticReclass = "DSS Source Statistic Reclass";
        public const string StatisticDriver = "DSS Statistic Driver";
        public const string CostingStatisticDriver = "DSS Costing Statistic Driver";
        public const string PhysicianCompensationCostingStatisticDriver = "DSS Physician Compensation Costing Statistic Driver";
        public const string Supply = "DSS Supply";
        public const string PatientEncounterClinicalIndicator = "DSS Patient Encounter Clinical Indicators";
        public const string EpisodePatientPopulations = "Episode Patient Populations";
        public const string PatientProceduralDetail = "DSS Patient Procedural Detail";
        public const string PatientDiagnosticDetail = "DSS Patient Diagnostic Detail";
        public const string PatientICD10ProceduralDetail = "DSS Patient ICD10 Procedural Detail";
        public const string PatientICD10DiagnosticDetail = "DSS Patient ICD10 Diagnostic Detail";
        public const string PatientPhysicianDetail = "DSS Patient Physician Detail";
        public const string PatientSupplyDetail = "DSS Patient Supply Detail";
        public const string PatientEAPGDetail = "DSS Patient EAPG Detail";
        public const string PatientEncounterOrderDetail = "DSS Patient Encounter Order Detail";
        public const string PatientEncounterEpisode = "DSS Patient Encounter Episode";
        public const string EncounterExpectedPaymentDetail = "DSS Expected Payment Detail";
        public const string EncounterStrataHistoryExpectedPayment = "DSS Encounter Strata History Expected Payment";
        public const string PatientEncounterDayType = "DSS Patient Encounter Day Type";
        public const string RevenueAllocationOut = "DSS Revenue Allocation Out";
        public const string AllocationEncounterDetail = "DSS Allocation Encounter Detail";
        public const string PatientCPTDetail = "DSS Patient CPT Detail";
        public const string PatientPaymentDetail = "DSS Patient Payment Detail";
        public const string StatisticsSampled = "DSS Statistics Sampled";
        public const string PayrollSampled = "DSS Payroll Sampled";
        public const string StaffingDetail = "DSS Patient Staffing Detail";
        public const string SurgicalDetail = "DSS Patient Surgical Detail";
        public const string PatientMembership = "DSS Membership";
        public const string MembershipStatistics = "Membership Statistics";
        public const string MembershipCost = "DSS Membership Cost";
        public const string SPBillingLineItemDetail = "DSS SP Billing Line Item Detail";
        public const string EventDetail = "DSS Patient Event Detail";

        #endregion

        #region Claims

        public const string PatientClaimChargeLineItemDetail = "DSS Patient Claim Charge Detail";
        public const string PatientClaimSummary = "DSS Patient Claim Summary";
        public const string PatientClaimsCostDetail = "DSS Patient Claims Cost Detail";
        public const string ClaimCostingStatisticDriver = "DSS Claim Costing Statistic Driver"; //ClaimCostingStatisticDriver table is output of processing claim detail level stats
        public const string ClaimStatisticDriver = "DSS Claim Statistic Driver"; //FactClaimStatisticDriver table that is imported into

        #endregion

        #region CCI 

        public const string StaffingDemand = "CCI Staffing Demand";

        #endregion

        #region OB / MR / PR

        public const string GLSampled = "GL Sampled";
        public const string PayrollSampledMonthly = "Payroll Sampled Monthly";
        public const string PayrollSampledPayPeriod = "Payroll Sampled Pay Period";
        public const string StatisticSampledMonthly = "Statistic Sampled Monthly";
        public const string StatisticSampledPayPeriod = "Statistic Sampled by Pay Period";
        public const string PrimaryStatisticSampledMonthly = "Statistic Primary Sampled Monthly";
        public const string PrimaryStatisticSampledPayPeriod = "Statistic Primary Sampled by Pay Period";
        public const string SecondaryStatisticSampledMonthly = "Statistic Secondary Sampled Monthly";
        public const string SecondaryStatisticSampledPayPeriod = "Statistic Secondary Sampled by Pay Period";
        public const string PrimaryStatisticsNonStaffingExpenseMonthly = "Primary Statistics Non-Staffing Expense Monthly";
        public const string PrimaryStatisticsStaffingMonthly = "Primary Statistics Staffing Monthly";
        public const string PrimaryStatisticsRevenueMonthly = "Primary Statistics Revenue Monthly";
        public const string PrimaryStatisticsNonStaffingByPayPeriod = "Primary Statistics Non-Staffing by Pay Period";
        public const string PrimaryStatisticsStaffingByPayPeriod = "Primary Statistics Staffing by Pay Period";
        public const string PrimaryStatisticsRevenueByPayPeriod = "Primary Statistics Revenue by Pay Period";
        public const string ProviderSampledMonthly = "Provider Sampled Monthly";

        #endregion 
    }
}