using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ISystemSettingRepository
    {
        public Task<Boolean> GetIsClaimsCostingEnabledAsync(CancellationToken cancellationToken);
        public Task<Boolean> GetIsCostingEntityLevelSecurityEnabledAsync(CancellationToken cancellationToken);
        public Task<Int32> GetCurrentFiscalYearAsync(CancellationToken cancellationToken);
    }
}