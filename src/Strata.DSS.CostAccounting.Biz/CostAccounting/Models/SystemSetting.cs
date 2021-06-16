using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class SystemSetting
    {
        public int SystemSettingId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Value { get; set; }
        public int ColumnType { get; set; }
        public string DefaultValue { get; set; }
        public bool IsEditable { get; set; }

        public SystemSetting()
        {
        }

        public bool IsCostingEntityLevelSecurityEnabled()
        {
            if(Name == "Is Costing Entity Level Security Enabled" && Value=="1")
            {
                return true;
            }
            return false;
        }
        public bool IsClaimsCostingEnabled()
        {
            if (Name == "Is Claims Costing Enabled" && Value == "1")
            {
                return true;
            }
            return false;
        }
    }
}