using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ISystemSettingRepository
    {
        public Task<bool> GetBoolSystemSettingByNameAsync(string name, CancellationToken cancellationToken);

        public Task<int> GetCurrentFiscalYearAsync(CancellationToken cancellationToken);
    }
}