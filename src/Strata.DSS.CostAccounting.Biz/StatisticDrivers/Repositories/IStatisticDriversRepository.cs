using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories
{
    public interface IStatisticDriversRepository
    {
        public Task<IEnumerable<DriverConfig>> GetStatisticDrivers(CancellationToken cancellationToken);
    }
}
