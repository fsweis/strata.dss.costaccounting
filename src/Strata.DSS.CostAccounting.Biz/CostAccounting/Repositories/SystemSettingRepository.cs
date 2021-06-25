using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public class SystemSettingRepository: ISystemSettingRepository
    {
        private readonly IMapper _mapper;
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;
        public SystemSettingRepository(IMapper mapper, IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory)
        {
            _mapper = mapper;
            _dbContextFactory = dbContextFactory;
        }

        public async Task<Boolean> GetIsClaimsCostingEnabledAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var systemSetting = await dbContext.SystemSettings.Where(x => x.Name == "Is Claims Costing Enabled").FirstOrDefaultAsync();
            if (Convert.ToInt32(systemSetting?.Value) == 1) { return true; }
            return false;
        }
        public async Task<Boolean> GetIsCostingEntityLevelSecurityEnabledAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var systemSetting = await dbContext.SystemSettings.Where(x => x.Name == "Is Costing Entity Level Security Enabled").FirstOrDefaultAsync();
            if (Convert.ToInt32(systemSetting?.Value) == 1) { return true; }
            return false;
        }

        public async Task<Int32> GetCurrentFiscalYearAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var systemSetting = await dbContext.SystemSettings.Where(x => x.Name == "Current FiscalYear").FirstOrDefaultAsync();
            if (systemSetting != null)
            {
                return Convert.ToInt32(systemSetting.Value);
            }
            return DateTime.Now.Year;
        }
    }
}

