using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{
    public interface IStatisticDriversService
    {
        public Task<IList<StatisticDriver>> LoadStatisticDrivers(CostingType costingType, CancellationToken cancellationToken);
    }
}

