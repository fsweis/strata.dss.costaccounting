using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
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
    }
}
