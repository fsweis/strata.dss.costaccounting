using System.ComponentModel;

namespace Strata.DSS.CostAccounting.Biz.Enums
{
    public enum eCostingMethod
    {
        Simultaneous = 0,
        SingleStepDown = 1,
        DoubleStepDown = 2,
        NLevelStepDown = 3
    }

    public enum eCostingType
    {
        [Description("Patient Care")]
        PatientCare = 0,
        [Description("Claims")]
        Claims = 1
    }

    public enum eReclassType
    {
        [Description("Percentage")]
        Percentage = 0,
        [Description("Dollars")]
        Dollars = 1,
        [Description("Statistic")]
        Statistic = 2
    }

    public enum eCostingReport
    {
        OverheadOutCostReport,
        AllocationClassificationReport,
        AllocationClassificationByDollarsReport,
        ClassificationCostComponentReport,
        DepartmentClassificationReport,
        ReclassReport,
        ReclassTabularReport,
        AccountVariabilityReport,
        JobCodeVariabilityReport,
        OverheadAllocationReport,
        ChargeAllocationAuditReport,
        ChargeAllocationAuditReportSheetBreakOut,
        ChargeAllocationVarianceReport,
        StatisticDriverReport,
        RealOverheadAllocationReport,
        RealOverheadAllocationTabularReport,
        CustomReport,
        ReclassTabularReportStat,
        ActivityBasedDetailComparisonReport,
        ChargeAllocationExport,
        CompensationCostComponentBreakoutReport,
        CompensationPhysicianActivityReport,
        CostingResultComparison,
        CompensationChargeAllocationVarianceReport
    }

    public enum eDefaultChargeAllocationMethod
    {
        RCC = 0,
        RVU = 1
    }

    public enum eChargeAllocationExportDataColumn
    {
        DepartmentCode = 0,
        DepartmentName,
        Charge,
        ChargeCode,
        ChargeCodeName,
        ChargePercent,
        UBRevenueCode,
        UBRevenueCodeName,
        UnitCharge,
        Volume,
        VolumePercentage
        //RCCPercent
    }

    public enum eScheduleRuleType
    {
        Any,
        All,
        None,
        Exclude
    }

    public enum eClinicalIndicatorType
    {
        Standard = 0,
        Readmit = 1,
        BaseReadmit = 2,
        PatientPopulation = 3
    }

    public enum eRuleEngineFilterCategory
    {
        All,
        PatientPopulation
    }

    public enum eRVUConfigStatus
    {
        InProgress,
        Submitted,
        Approved,
        Rejected,
        Applied
    }

    public enum eServiceLineEditType
    {
        Full,
        None,
        EditRuleSetsOnly
    }
}
