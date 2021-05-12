using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz
{
    public static class CostingConstants
    {
        public const string EXCLUDED_COSTCOMPONENT_NAME = "Excluded";
        public const string EXCLUDED_DEPARTMENT_CLASS_NAME = "Excluded";
        public const string REVENUE_DEPARTMENT_CLASS_NAME = "Revenue";
        public const string OVERHEAD_DEPARTMENT_CLASS_NAME = "Overhead";

        public const string DEPT_CLASS_TAGNAME = "Department Categorization";
        public static string COST_COMPONENT_TAG = "Cost Category";
        public static string DRIVER_TAG = "Driver Config";

        public static byte TIMECLASS_ID_ACTUAL = 1;
        public static byte TIMECLASS_ID_BUDGETED = 2;
        public static byte TIMECLASS_ID_FLEXED = 4;

        public const string COLUM_NAME_FISCALYEARID = "FiscalYearID";
        public const string COLUM_NAME_DEPARTMENTID = "DepartmentID";
        public const string COLUM_NAME_CHARGECODEID = "ChargeCodeID";
        public const string COLUM_NAME_ENCOUNTERID = "EncounterID";
        public const string COLUM_NAME_COMPENSATIONPHYSICIANID = "CompensationPhysicianID";
        public const string COLUM_NAME_NPI = "NPI";
        public const string COLUM_NAME_UNITSOFSERVICE = "UnitsOfService";
        public const string COLUM_NAME_BILLEDUNITSOFSERVICE = "BilledUnitsOfService";
        public const string COLUM_NAME_CHARGE = "Charge";
        public const string COLUMN_NAME_SUPPLYTOTALCOST = "SupplyTotalCost";
        public const string COLUM_NAME_PERCENTAGEMARKUPCOST = "PercentageMarkupCost";

        public const string ALL_ONES_GUID_STRING = "11111111-1111-1111-1111-111111111111";
        public const string STRATASPHERE_COST_MODEL_NAME_PREFIX = "StrataSphere Cost Model";

        #region Claims

        public const string COLUMN_NAME_CLAIMNUMBERID = "ClaimNumberID";

        #endregion

        #region " Reporting "

        public const string CLASSIFICATIONREPORT_ALLOCATION_NAME = "Unclassified Dollar Exceptions";
        public const string CLASSIFICATIONREPORT_ALLOCATION_GLOBALID = "DSS Unclassified Dollar Exceptions";

        public const string CLASSIFICATIONREPORT_COSTING_NAME = "Costing Classifications";
        public const string CLASSIFICATIONREPORT_COSTING_GLOBALID = "DSS Costing Classifications Audit";

        public const string CLASSIFICATIONREPORT_DEPARTMENT_NAME = "Department Classifications";
        public const string CLASSIFICATIONREPORT_DEPARTMENT_GLOBALID = "DSS Department Classifications";

        public const string COSTING_ALLOCATION_AUDIT = "Charge Allocation Audit";
        public const string COSTING_ALLOCATION_AUDIT_BREAKOUT = "Charge Allocation Audit with Breakout";
        public const string COSTING_ALLOCATION_AUDIT_VARIANCE = "Charge Allocation Variance";
        public const int COSTINGRESULTID_DEFAULT = -1;

        public const string DEPARTMENT_FILTER_PARAMETER = "DEPARTMENTS_FILTER";
        public const string JOB_CODE_FILTER_PARAMETER = "JOB_CODES_FILTER";
        #endregion

        #region " Redis Messaging "

        public static string REDIS_STATUS_COSTING = "CostingStatus";
        public static string REDIS_KILL_COSTING_SUBSCRIBERS = "CostingSubscribersKillMessage";

        #endregion
    }
}
