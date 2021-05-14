using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using System.Linq;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.Enums;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories
{
    public class StatisticDriversRepository:IStatisticDriversRepository
    {
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;

        public StatisticDriversRepository(IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }
        public async Task<IEnumerable<DriverConfig>> GetStatisticDriversAsync(byte costingType, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var allOnesGuid = new Guid(CostingConstants.ALL_ONES_GUID_STRING);
            var drivers = await dbContext.DriverConfigs.Where(dc => dc.DriverConfigGUID != Guid.Empty && dc.DriverConfigGUID != allOnesGuid && dc.CostingConfigGUID == Guid.Empty && dc.CostingType==costingType).OrderBy(dr => dr.Name).ToListAsync(cancellationToken);
            return drivers;
        }
    }
}
