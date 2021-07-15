using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ISystemSettingRepository
    {
        public Task<bool> GetBooleanSystemSettingByNameAsync(string name, CancellationToken cancellationToken);
        public Task<int> GetIntegerSystemSettingByNameAsync(string name, CancellationToken cancellationToken);
    }
}