using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.Enums
{
    public enum CostingMethod
    {
        Simultaneous = 0,
        SingleStepDown = 1,
        DoubleStepDown = 2,
        NLevelStepDown = 3
    }
}
