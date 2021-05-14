using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.DTOs
{
    public class StatisticDriverDTO
    {
        public List<StatisticDriver> StatisticDrivers { get; set; }
        public List<DataTable> DataSources { get; set; }
        public List<DataSourceLink> DataSourceLinks { get; set; }
    }
}
