using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories
{
    public class CostingConfigRepository : ICostingConfigRepository
    {
        private readonly IMapper _mapper;
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;

        public CostingConfigRepository(IMapper mapper,IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory)
        {
            _mapper = mapper;
            _dbContextFactory = dbContextFactory;
        }
        public async Task<IEnumerable<CostingConfigModel>> GetAllCostingConfigsAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var costingConfigs = await dbContext.CostingConfigs.ToListAsync(cancellationToken);

            if(!costingConfigs.Any())
            {
                return null;
            }

            return _mapper.Map<IEnumerable<CostingConfigModel>>(costingConfigs);
        }

        public async Task<CostingConfigModel> GetCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {            
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entity = await dbContext.CostingConfigs.FirstOrDefaultAsync(cc => cc.CostingConfigGuid == costingConfigGuid,cancellationToken);
            return _mapper.Map<CostingConfigModel>(entity);           
        }

        public async Task<IEnumerable<FiscalMonth>> GetFiscalMonthsAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var fiscalMonths = await dbContext.FiscalMonths.ToListAsync(cancellationToken);

            if (!fiscalMonths.Any())
            {
                return null;
            }

            return _mapper.Map<IEnumerable<FiscalMonth>>(fiscalMonths);
        }

        public async Task<IEnumerable<FiscalYear>> GetFiscalYearsAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var fiscalYears = await dbContext.FiscalYears.ToListAsync(cancellationToken);

            if (!fiscalYears.Any())
            {
                return null;
            }

            return _mapper.Map<IEnumerable<FiscalYear>>(fiscalYears);
        }

        public async Task<IEnumerable<Entity>> GetEntitiesAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entities = await dbContext.Entities.ToListAsync(cancellationToken);

            if (!entities.Any())
            {
                return null;
            }

            return _mapper.Map<IEnumerable<Entity>>(entities);
        }
        public async Task<IEnumerable<SystemSetting>> GetSystemSettingsAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var systemSettings = await dbContext.SystemSettings.ToListAsync(cancellationToken);

            if (!systemSettings.Any())
            {
                return null;
            }

            return _mapper.Map<IEnumerable<SystemSetting>>(systemSettings);
        }

        public async Task<IEnumerable<CostingConfigEntityLevelSecurity>> GetCCELSAsync(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var ccels = await dbContext.CCELS.ToListAsync(cancellationToken);

            if (!ccels.Any())
            {
                return null;
            }

            return _mapper.Map<IEnumerable<CostingConfigEntityLevelSecurity>>(ccels);
        }

        public async Task<CostingConfigEntity> AddNewCostingConfigAsync(CostingConfigModel costingConfigModel, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
           
           var newConfig = _mapper.Map<CostingConfigEntity>(costingConfigModel);
           dbContext.CostingConfigs.Add(newConfig);
            await dbContext.SaveChangesAsync(cancellationToken);
            return newConfig;

        }
    }
}
