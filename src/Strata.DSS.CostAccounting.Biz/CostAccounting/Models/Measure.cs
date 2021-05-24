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
            switch ((SQLDataType)ColumnTypeValue)
            {
                case SQLDataType.BigInt:
                    return true;
                case SQLDataType.Decimal:
                    return true;
                case SQLDataType.Float:
                    return true;
                case SQLDataType.Int:
                    return true;
                case SQLDataType.Money:
                    return true;
                case SQLDataType.Real:
                    return true;
                case SQLDataType.SmallInt:
                    return true;
                case SQLDataType.SmallMoney:
                    return true;
                case SQLDataType.TinyInt:
                    return true;
                default:
                    return false;
            }
        }
    }
}
