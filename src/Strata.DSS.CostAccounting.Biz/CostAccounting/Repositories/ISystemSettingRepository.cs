using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ISystemSettingRepository
    {
        public Task<bool> GetIsClaimsCostingEnabledAsync(CancellationToken cancellationToken);
        public Task<bool> GetIsCostingEntityLevelSecurityEnabledAsync(CancellationToken cancellationToken);
        public Task<int> GetCurrentFiscalYearAsync(CancellationToken cancellationToken);
    }
}