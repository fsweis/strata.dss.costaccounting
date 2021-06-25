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
    public class CostingConfigRepository : ICostingConfigRepository
    {
        private readonly IMapper _mapper;
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;

        public CostingConfigRepository(IMapper mapper, IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory)
        {
            _mapper = mapper;
            _dbContextFactory = dbContextFactory;
        }

        public async Task<IEnumerable<CostingConfigModel>> GetAllCostingConfigsAsync(CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var costingConfigs = await dbContext.CostingConfigs.ToListAsync(cancellationToken);
            return _mapper.Map<IEnumerable<CostingConfigModel>>(costingConfigs);
        }

        public async Task<CostingConfigModel> GetCostingConfigAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var entity = await dbContext.CostingConfigs.FirstOrDefaultAsync(cc => cc.CostingConfigGuid == costingConfigGuid, cancellationToken);
            return _mapper.Map<CostingConfigModel>(entity);
        }

        public async Task<IEnumerable<CostingConfigEntityLevelSecurity>> GetCostingConfigEntityLevelSecuritiesAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var ccels = await dbContext.CostingConfigEntityLevelSecurities.Where(x => x.CostingConfigGuid == costingConfigGuid).ToListAsync(cancellationToken);
            return _mapper.Map<IEnumerable<CostingConfigEntityLevelSecurity>>(ccels);
        }

        public async Task<IEnumerable<CostingConfigEntityLinkage>> GetCostingConfigEntityLinkagesAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var ccels = await dbContext.CostingConfigEntityLinkages.Where(x => x.CostingConfigGuid == costingConfigGuid).ToListAsync(cancellationToken);
            return _mapper.Map<IEnumerable<CostingConfigEntityLinkage>>(ccels);
        }

        public async Task UpdateCostingConfigEntityLinkagesAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            dbContext.CostingConfigEntityLinkages.AddRange(cceLinks);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteCostingConfigEntityLinkagesAsync(List<CostingConfigEntityLinkage> cceLinks, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            dbContext.CostingConfigEntityLinkages.RemoveRange(cceLinks);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task AddNewCostingConfigAsync(CostingConfigModel costingConfigModel, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var newConfig = _mapper.Map<CostingConfigEntity>(costingConfigModel);
            dbContext.CostingConfigs.Add(newConfig);

            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
