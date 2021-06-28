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
            switch ((SqlDataType2)ColumnTypeValue)
            {
                case SqlDataType2.BigInt:
                    return true;
                case SqlDataType2.Decimal:
                    return true;
                case SqlDataType2.Float:
                    return true;
                case SqlDataType2.Int:
                    return true;
                case SqlDataType2.Money:
                    return true;
                case SqlDataType2.Real:
                    return true;
                case SqlDataType2.SmallInt:
                    return true;
                case SqlDataType2.SmallMoney:
                    return true;
                case SqlDataType2.TinyInt:
                    return true;
                default:
                    return false;
            }
        }
    }
}
