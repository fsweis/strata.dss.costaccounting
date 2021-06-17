using Strata.DSS.CostAccounting.Biz.CostingConfigs.Constants;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Models
{
    public class ConfigCostingType
    {
        #region Properties
        public CostingType Type { get; set; }
        public string FriendlyName { get; set; }

        #endregion

        #region .ctor

        public ConfigCostingType(CostingType type, string friendlyName)
        {
            Type = type;
            FriendlyName = friendlyName;
        }

        #endregion

        #region Overrides

        public override string ToString()
        {
            return FriendlyName;
        }
        public override bool Equals(object obj)
        {
            return obj != null && obj is ConfigCostingType && (obj as ConfigCostingType).Type == Type;
        }
        public override int GetHashCode()
        {
            return FriendlyName.GetHashCode();
        }

        #endregion

        #region Factory Methods

        public static IEnumerable<ConfigCostingType> GetAll()
        {
            yield return new ConfigCostingType(CostingType.PatientCare, CostingTypeConstants.PatientCare_FriendlyName);
            yield return new ConfigCostingType(CostingType.Claims, CostingTypeConstants.Claims_FriendlyName);
        }

        public static ConfigCostingType GetByType(CostingType type)
        {
            return GetAll().FirstOrDefault(c => c.Type == type);
        }

        #endregion
    }
}
