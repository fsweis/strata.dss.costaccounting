using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.Enums
{
    public enum ReclassType
    {
        [Description("Percentage")]
        Percentage = 0,
        [Description("Dollars")]
        Dollars = 1,
        [Description("Statistic")]
        Statistic = 2
    }
}
