using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories
{
    public interface IStatisticDriversRepository
    {
        public Task<IEnumerable<DriverConfigView>> GetDriverConfigsAsync(CostingType costingType, CancellationToken cancellationToken);
        public Task<List<Guid>> GetUsedDriverConfigs(CancellationToken cancellationToken);
        public Task<Boolean> AddStatisticDriversAsync(List<StatisticDriver> statisticDrivers, CancellationToken cancellationToken);
        public Task<Boolean> UpdateStatisticDriversAsync(List<StatisticDriver> statisticDrivers, CancellationToken cancellationToken);
        public Task<Boolean> DeleteStatisticDriversAsync(List<Guid> statisticDriverGuids, CancellationToken cancellationToken);
    }
}
