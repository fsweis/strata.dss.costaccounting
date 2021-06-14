using Strata.DSS.CostAccounting.Biz.CostingConfigs.Constants;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class ConfigCostingMethod
    {
        public CostingMethod Method { get; set; }
        public string FriendlyName { get; set; }

        public ConfigCostingMethod(CostingMethod method, string friendlyName)
        {
            Method = method;
            FriendlyName = friendlyName;
        }

        public override bool Equals(object obj)
        {
            return obj != null && obj is ConfigCostingMethod && (obj as ConfigCostingMethod).Method == Method;
        }
        public override int GetHashCode()
        {
            return FriendlyName.GetHashCode();
        }

        public static IEnumerable<ConfigCostingMethod> LoadAll()
        {
            yield return new ConfigCostingMethod(CostingMethod.Simultaneous, CostingMethodContants.Simultaneous_FriendlyName);
            yield return new ConfigCostingMethod(CostingMethod.SingleStepDown, CostingMethodContants.SingleStepDown_FriendlyName);
            yield return new ConfigCostingMethod(CostingMethod.DoubleStepDown, CostingMethodContants.DoubleStepDown_FriendlyName);
            yield return new ConfigCostingMethod(CostingMethod.NLevelStepDown, CostingMethodContants.NLevelStepDown_FriendlyName);
        }

        public static ConfigCostingMethod LoadByMethod(CostingMethod method)
        {
            return LoadAll().FirstOrDefault(c => c.Method == method);
        }
    }
}
