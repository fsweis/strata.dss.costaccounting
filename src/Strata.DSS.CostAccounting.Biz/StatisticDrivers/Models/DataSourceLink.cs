using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models
{
    public class DataSourceLink
    {
        public Guid MeasureGuid { get; set; }
        public Guid DataTableGuid { get; set; }
        public string FriendlyName { get; set; }
        public bool IsFirstSelect { get; set; }

        public DataSourceLink(Measure measure)
        {
            MeasureGuid = measure.MeasureGuid;
            FriendlyName = measure.FriendlyName;
            DataTableGuid = measure.DataTableGuid;
            IsFirstSelect = false;
        }

        public DataSourceLink(Guid measureGuid, string measureFriendlyName, Guid dataTableGuid, bool isFirstSelect)
        {
            MeasureGuid = measureGuid;
            FriendlyName = measureFriendlyName;
            DataTableGuid = dataTableGuid;
            IsFirstSelect = isFirstSelect;
        }
    }
}
