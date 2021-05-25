
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{
    public interface IDataSourceLinkService
    {
        public Task<IList<DataSourceLink>> GetDataSourceLinks(Boolean isClaims);
    }
}

