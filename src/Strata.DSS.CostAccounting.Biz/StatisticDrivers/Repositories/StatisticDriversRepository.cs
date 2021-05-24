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
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories
{
    public class StatisticDriversRepository:IStatisticDriversRepository
    {
        private readonly IAsyncDbContextFactory<CostAccountingDbContext> _dbContextFactory;

        public StatisticDriversRepository(IAsyncDbContextFactory<CostAccountingDbContext> dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }
        public async Task<IEnumerable<DriverConfigView>> GetDriverConfigsAsync(CostingType costingType, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var allOnesGuid = new Guid(GeneralConstants.ALL_ONES_GUID_STRING);
            var drivers = await dbContext.DriverConfigViews.Where(dc => dc.DriverConfigGuid != Guid.Empty && dc.DriverConfigGuid != allOnesGuid && dc.CostingConfigGuid == Guid.Empty && dc.CostingType==costingType).OrderBy(dr => dr.Name).ToListAsync(cancellationToken);
            return drivers;
           
        }

        public async Task<List<Guid>> GetUsedDriverConfigs(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var driverConfigGuids = dbContext.AccountReclasses.Select(x => x.DriverConfigGuid)
                                           .Union(dbContext.PayCodeJobCodeReclasses.Select(x=>x.DriverConfigGuid))
                                           .Union(dbContext.DepartmentReclasses.Select(x => x.DriverConfigGuid))
                                           .Union(dbContext.AllocationConfigs.Select(x => x.DriverConfigGuid))
                                           .Union(dbContext.AllocationConfigOverrides.Select(x => x.DriverConfigGuid)).ToList();
           
            return driverConfigGuids;
        }

        public async Task<Boolean> UpdateStatisticDriversAsync(List<StatisticDriver>statisticDrivers, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            foreach (var statDriver in statisticDrivers)
           {
                var driver = await dbContext.DriverConfigs.Where(dc => dc.DriverConfigGuid == statDriver.DriverConfigGuid).FirstOrDefaultAsync();
                driver.MeasureGuid = statDriver.MeasureGuid;
                driver.IsInverted = statDriver.IsInverted;
                driver.Name = statDriver.Name;
           }

            try
            {
                await dbContext.SaveChangesAsync(cancellationToken);
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }

        public async Task<Boolean> AddStatisticDriversAsync(List<StatisticDriver> statisticDrivers, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            foreach (var statDriver in statisticDrivers)
            {
                var driverConfig = new DriverConfig()
                {
                    DriverConfigGuid = statDriver.DriverConfigGuid,
                    MeasureGuid = statDriver.MeasureGuid,
                    IsInverted = statDriver.IsInverted,
                    Name = statDriver.Name,
                    CostingType = statDriver.CostingType
                };

                dbContext.DriverConfigs.Add(driverConfig);
            }

            try { 
             await dbContext.SaveChangesAsync(cancellationToken);
            }catch(Exception e)
            {
                return false;
            }

            return true;
        }

        public async Task<Boolean> DeleteStatisticDriversAsync(List<Guid> statisticDriverGuids, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            foreach (var statDriverGuid in statisticDriverGuids)
            {
                var driver = await dbContext.DriverConfigs.Where(dc => dc.DriverConfigGuid == statDriverGuid).FirstOrDefaultAsync();
                dbContext.Remove(driver);
            }

            try
            {
                await dbContext.SaveChangesAsync(cancellationToken);
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }
    }
}
