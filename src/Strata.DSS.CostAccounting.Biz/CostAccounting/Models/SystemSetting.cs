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
    }
}