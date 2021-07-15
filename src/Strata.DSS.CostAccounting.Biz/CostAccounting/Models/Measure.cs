using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class Measure
    {
        public string FriendlyName { get; set; }
        public Guid MeasureGuid { get; set; }
        public Guid DataTableGuid { get; set; }
        public string SQLColumnName { get; set; }
        public byte ColumnTypeValue { get; set; }

        public bool IsNumericMeasure()
        {
            switch ((SqlDataType)ColumnTypeValue)
            {
                case SqlDataType.BigInt:
                    return true;
                case SqlDataType.Decimal:
                    return true;
                case SqlDataType.Float:
                    return true;
                case SqlDataType.Int:
                    return true;
                case SqlDataType.Money:
                    return true;
                case SqlDataType.Real:
                    return true;
                case SqlDataType.SmallInt:
                    return true;
                case SqlDataType.SmallMoney:
                    return true;
                case SqlDataType.TinyInt:
                    return true;
                default:
                    return false;
            }
        }
    }
}
