using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz
{
   public static class MeasureConstants
    {
        public const string DummyMeasure = "DummyValue";
        public const string AdmitDateTime = "AdmitDateTime";
        public const string DischargeDateTime = "DischargeDateTime";
        public const string ServiceDateTime = "ServiceDateTime";
        public const string PostDateTime = "PostDateTime";
        public const string DollarsMeasure = "Dollars";
        public const string UnitsMeasure = "Units";

        //Payroll
        public const string YTDHoursMeasure = "YTDHours";
        public const string YTDDollarsMeasure = "YTDDollars";

        // Statistics
        public const string YTDUnitsMeasure = "YTDUnits";
        public const string PrimaryStatisticSampledMonthlyAmount = "Statistic Primary Sampled Monthly Amount";
        public const string PrimaryStatisticsRevenueMonthlyAmount = "Primary Statistics Revenue Monthly Amount";
        public const string PrimaryStatisticsStaffingMonthlyAmount = "Primary Statistics Staffing Monthly Amount";
        public const string PrimaryStatisticsNonStaffingExpenseMonthlyAmount = "Primary Statistics Non-Staffing Expense Monthly Amount";

        //Patient Encounter Summary
        public const string PES_AccountBalance = "AccountBalance";
        public const string PES_APCExpectedPayment = "APCExpectedPayment";
        public const string PES_BadDebt = "Bad Debt";
        public const string PES_BadDebtBalance = "BadDebtBalance";
        public const string PES_HistoricExpectedPayment = "HistoricExpectedPayment";
        public const string PES_MedicareExpectedPayment = "MedicareExpectedPayment";
        public const string PES_TotalActualAdjustments = "TotalActualAdjustments";
        public const string PES_TotalActualPayments = "TotalActualPayments";
        public const string PES_TotalCoinsuranceAmount = "Total Coinsurance Amount";
        public const string PES_TotalCoveredCharges = "Total Covered Charges";
        public const string PES_TotalCoveredDays = "Total Covered Days";
        public const string PES_TotalDeductibleAmount = "Total Deductible Amount";
        public const string PES_TotalNoncoveredDays = "Total Noncovered Days";
        public const string PES_ExpectedPayment = "Expected Payment";
        public const string PES_EncounterRecordNumber_ColumnName = "EncounterRecordNumber";
        public const string PES_LOS_ColumnName = "LengthOfStay";
        public const string PES_TotalCharges_ColumnName = "TotalCharges";
        public const string PES_PatientResponsibility = "Patient Responsibility";

        //Patien Billing
        public const string ChargeMeasure = "Charge";
        public const string DaysMeasure = "Days";
        public const string MRVUMeasure = "MRVU";
        public const string ORVUMeasure = "ORVU";
        public const string TRVUMeasure = "TRVU";
        public const string WRVUMeasure = "WRVU";
        public const string UnitsOfServiceMeasure = "UnitsOfService";
        public const string BilledUnitsOfServiceMeasure = "BilledUnitsOfService";
        public const string StaffTime = "StaffTime";
        public const string SurgeryTime = "SurgeryTime";

        //Patient Event Detail
        public const string EventDuration = "EventDuration";

        #region Claims

        public const string PCS_ClaimRecordNumber_ColumnName = "ClaimRecordNumber";

        #endregion
    }
}
