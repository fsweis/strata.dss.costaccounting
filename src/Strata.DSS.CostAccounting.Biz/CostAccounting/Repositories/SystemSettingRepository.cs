using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public class SystemSettingRepository : ISystemSettingRepository
    {
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;
        public SystemSettingRepository(IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }

        public async Task<bool> GetBooleanSystemSettingByNameAsync(string name, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var systemSetting = await dbContext.SystemSettings.Where(x => x.Name == name).FirstOrDefaultAsync();
            if (Convert.ToInt32(systemSetting?.Value) == 1) { return true; }

            return false;
        }

        public async Task<int> GetIntegerSystemSettingByNameAsync(string name, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var systemSetting = await dbContext.SystemSettings.Where(x => x.Name == name).FirstOrDefaultAsync();
            if (systemSetting != null)
            {
                return Convert.ToInt32(systemSetting.Value);
            }

            return 0;
        }
    }
}