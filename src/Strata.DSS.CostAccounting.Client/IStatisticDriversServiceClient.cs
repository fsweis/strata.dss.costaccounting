using Strata.DSS.CostAccounting.Client.DTO;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Client
{
    public interface IStatisticDriversServiceClient
    {
        Task<IEnumerable<StatisticDriver>> GetStatisticDrivers(CancellationToken cancellationToken = default);
        Task<IEnumerable<DataTable>> GetDataSources(CancellationToken cancellationToken = default);
        Task<IEnumerable<DataSourceLink>> GetDataSourceLinks(CancellationToken cancellationToken = default);
        Task<IEnumerable<StatisticDriver>> SaveStatisticDrivers(StatisticDriverSaveData statisticDriverSaveData, CancellationToken cancellationToken = default);
    }
}
