using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories
{
    public class StatisticDriversRepository : IStatisticDriversRepository
    {
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;

        public StatisticDriversRepository(IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }

        public async Task<IEnumerable<DriverConfigView>> GetDriverConfigsAsync(CostingType costingType, CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var allOnesGuid = new Guid(GeneralConstants.ALL_ONES_GUID_STRING);
            var drivers = await dbContext.DriverConfigViews.Where(dc => dc.DriverConfigGuid != Guid.Empty && dc.DriverConfigGuid != allOnesGuid && dc.CostingConfigGuid == Guid.Empty && dc.CostingType == costingType).OrderBy(dr => dr.Name).ToListAsync(cancellationToken);
            return drivers;
        }

        public async Task<List<Guid>> GetUsedDriverConfigs(CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var driverConfigGuids = dbContext.AccountReclasses.Select(x => x.DriverConfigGuid)
                                           .Union(dbContext.PayCodeJobCodeReclasses.Select(x => x.DriverConfigGuid))
                                           .Union(dbContext.DepartmentReclasses.Select(x => x.DriverConfigGuid))
                                           .Union(dbContext.AllocationConfigs.Select(x => x.DriverConfigGuid))
                                           .Union(dbContext.AllocationConfigOverrides.Select(x => x.DriverConfigGuid)).ToList();

            return driverConfigGuids;
        }

        public async Task UpdateStatisticDriversAsync(List<StatisticDriver> statisticDrivers, CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            foreach (var statDriver in statisticDrivers.Where(d => d.DriverConfigGuid != Guid.Empty))
            {
                var driver = await dbContext.DriverConfigs.Where(dc => dc.DriverConfigGuid == statDriver.DriverConfigGuid).FirstOrDefaultAsync();
                if (driver != null)
                {
                    driver.MeasureGuid = statDriver.MeasureGuid;
                    driver.IsInverted = statDriver.IsInverted;
                    driver.Name = statDriver.Name;
                }
            }

            foreach (var newStatDriver in statisticDrivers.Where(d => d.DriverConfigGuid == Guid.Empty))
            {
                var driverConfig = new DriverConfig()
                {
                    DriverConfigGuid = Guid.NewGuid(),
                    MeasureGuid = newStatDriver.MeasureGuid,
                    IsInverted = newStatDriver.IsInverted,
                    Name = newStatDriver.Name,
                    CostingType = newStatDriver.CostingType
                };

                dbContext.DriverConfigs.Add(driverConfig);
            }

            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteStatisticDriversAsync(List<Guid> statisticDriverGuids, CancellationToken cancellationToken)
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            foreach (var statDriverGuid in statisticDriverGuids)
            {
                var driver = await dbContext.DriverConfigs.Where(dc => dc.DriverConfigGuid == statDriverGuid).FirstOrDefaultAsync();
                dbContext.Remove(driver);
            }

            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
