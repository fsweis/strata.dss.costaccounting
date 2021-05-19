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
        public Task<IEnumerable<DriverConfig>> GetStatisticDriversAsync(byte costingType, CancellationToken cancellationToken);
        public Task<Boolean> ValidateRemoveAsync(Guid driverConfigGUID, CancellationToken cancellationToken);
        public Task<Boolean> AddStatisticDriversAsync(List<StatisticDriver> statisticDrivers, CancellationToken cancellationToken);
        public Task<Boolean> UpdateStatisticDriversAsync(List<StatisticDriver> statisticDrivers, CancellationToken cancellationToken);
        public Task<Boolean> DeleteStatisticDriversAsync(List<Guid> statisticDriverGUIDs, CancellationToken cancellationToken);
    }
}
