using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using System.Collections.Generic;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{
    public interface IDataSourceService
    {
        public IList<DataTable> GetDataSources(CostingType costingType);
    }
}

