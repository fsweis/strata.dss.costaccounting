using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Models
{
    public class Measure
    {
        public string FriendlyName { get; set; }
        public Guid MeasureGUID { get; set; }
        public Guid DataTableGUID { get; set; }
        public string SQLColumnName { get; set; }
        public byte ColumnTypeValue { get; set; }

        public bool IsNumericMeasure()
        {
            switch ((eSQLDataType)ColumnTypeValue)
            {
                case eSQLDataType.BigInt:
                    return true;
                case eSQLDataType.Decimal:
                    return true;
                case eSQLDataType.Float:
                    return true;
                case eSQLDataType.Int:
                    return true;
                case eSQLDataType.Money:
                    return true;
                case eSQLDataType.Real:
                    return true;
                case eSQLDataType.SmallInt:
                    return true;
                case eSQLDataType.SmallMoney:
                    return true;
                case eSQLDataType.TinyInt:
                    return true;
                default:
                    return false;
            }
        }
    }
}
