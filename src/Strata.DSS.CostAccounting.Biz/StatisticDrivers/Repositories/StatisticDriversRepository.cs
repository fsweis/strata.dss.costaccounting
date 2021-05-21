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
        public async Task<IEnumerable<DriverConfig>> GetDriverConfigsAsync(CostingType costingType, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            var allOnesGuid = new Guid(CostingConstants.ALL_ONES_GUID_STRING);
            var drivers = await dbContext.DriverConfigs.Where(dc => dc.DriverConfigGUID != Guid.Empty && dc.DriverConfigGUID != allOnesGuid && dc.CostingConfigGUID == Guid.Empty && dc.CostingType==costingType).OrderBy(dr => dr.Name).ToListAsync(cancellationToken);
            return drivers;
           
        }

        public async Task<List<Guid>> GetUsedDriverConfigs(CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var driverConfigGUIDs = dbContext.AccountReclasses.Select(x => x.DriverConfigGUID)
                                           .Union(dbContext.PayCodeJobCodeReclasses.Select(x=>x.DriverConfigGUID))
                                           .Union(dbContext.DepartmentReclasses.Select(x => x.DriverConfigGUID))
                                           .Union(dbContext.AllocationConfigs.Select(x => x.DriverConfigGUID))
                                           .Union(dbContext.AllocationConfigOverrides.Select(x => x.DriverConfigGUID)).ToList();
           
            return driverConfigGUIDs;
        }

        public async Task<Boolean> UpdateStatisticDriversAsync(List<StatisticDriver>statisticDrivers, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            foreach (var statDriver in statisticDrivers)
           {
                var driver = await dbContext.DriverConfigs.Where(dc => dc.DriverConfigGUID == statDriver.DriverConfigGUID).FirstOrDefaultAsync();
                driver.MeasureGUID = statDriver.MeasureGUID;
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
                    DriverConfigGUID = statDriver.DriverConfigGUID,
                    MeasureGUID = statDriver.MeasureGUID,
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

        public async Task<Boolean> DeleteStatisticDriversAsync(List<Guid> statisticDriverGUIDs, CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
            foreach (var statDriverGUID in statisticDriverGUIDs)
            {
                var driver = await dbContext.DriverConfigs.Where(dc => dc.DriverConfigGUID == statDriverGUID).FirstOrDefaultAsync();
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
