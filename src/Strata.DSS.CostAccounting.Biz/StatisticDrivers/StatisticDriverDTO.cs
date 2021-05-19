using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers
{
    public class StatisticDriverDTO
    {
        public IList<StatisticDriver> StatisticDrivers { get; set; }
        public IList<DataTable> DataSources { get; set; }
        public IList<DataSourceLink> DataSourceLinks { get; set; }
    }
}
