using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class DataSourceLink
    {
        public Guid MeasureGUID { get; set; }
        public Guid DataTableGUID { get; set; }
        public string FriendlyName { get; set; }
        public bool IsFirstSelect { get; set; }

        public DataSourceLink(Measure measure)
        {
            MeasureGUID = measure.MeasureGUID;
            FriendlyName = measure.FriendlyName;
            DataTableGUID = measure.DataTableGUID;
            IsFirstSelect = false;
        }

        public DataSourceLink(Guid measureGUID, string measureFriendlyName, Guid dataTableGUID, bool isFirstSelect)
        {
            MeasureGUID = measureGUID;
            FriendlyName = measureFriendlyName;
            DataTableGUID = dataTableGUID;
            IsFirstSelect = isFirstSelect;
        }
    }
}
