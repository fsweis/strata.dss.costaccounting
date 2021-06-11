using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public interface ICostingConfigRepository
    {
        public Task<IEnumerable<CostingConfigModel>> GetAllCostingConfigsAsync(CancellationToken cancellationToken);
        public Task<CostingConfigModel> GetCostingConfigAsync(Guid id, CancellationToken cancellationToken);

        public Task<IEnumerable<FiscalMonth>> GetFiscalMonthsAsync( CancellationToken cancellationToken);
        public Task<IEnumerable<FiscalYear>> GetFiscalYearsAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<Entity>> GetEntitiesAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<SystemSetting>> GetSystemSettingsAsync(CancellationToken cancellationToken);
        public Task<IEnumerable<CostingConfigEntityLevelSecurity>> GetCCELSAsync(CancellationToken cancellationToken);
        public Task<CostingConfigEntity> AddNewCostingConfigAsync(CostingConfigModel costingConfigModel, CancellationToken cancellationToken);
    }
}
