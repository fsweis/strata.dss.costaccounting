using System.ComponentModel;

namespace Strata.DSS.CostAccounting.Biz.Enums
{
    public enum CostingType : byte
    {
        [Description("Patient Care")]
        PatientCare = 0,
        [Description("Claims")]
        Claims = 1
    }
}
