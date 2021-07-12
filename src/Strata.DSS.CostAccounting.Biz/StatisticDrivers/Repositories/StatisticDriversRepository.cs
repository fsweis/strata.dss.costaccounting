using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Constants;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories
{
    public class StatisticDriversRepository : IStatisticDriversRepository
    {
        private readonly CostAccountingDbContext _dbContext;

        public StatisticDriversRepository(CostAccountingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<DriverConfigView>> GetDriverConfigsAsync(CostingType costingType, CancellationToken cancellationToken)
        {
            var allOnesGuid = new Guid(GeneralConstants.ALL_ONES_GUID_STRING);

            var drivers = await _dbContext.DriverConfigViews.Where(dc => dc.DriverConfigGuid != Guid.Empty && dc.DriverConfigGuid != allOnesGuid && dc.CostingConfigGuid == Guid.Empty && dc.CostingType == costingType).OrderBy(dr => dr.Name).ToListAsync(cancellationToken);
            foreach (var driver in drivers.Where(d => d.MeasureGuid == new Guid(SDDataTableConstants.GL_PAYROLL_DATASOURCE_ID)))
            {
                driver.DataTableGuid = new Guid(SDDataTableConstants.GL_PAYROLL_DATASOURCE_ID);
            }

            return drivers;
        }

        public List<Guid> GetUsedDriverConfigs(CancellationToken cancellationToken)
        {
            var driverConfigGuids = _dbContext.AccountReclasses.Select(x => x.DriverConfigGuid)
                                           .Union(_dbContext.PayCodeJobCodeReclasses.Select(x => x.DriverConfigGuid))
                                           .Union(_dbContext.DepartmentReclasses.Select(x => x.DriverConfigGuid))
                                           .Union(_dbContext.AllocationConfigs.Select(x => x.DriverConfigGuid))
                                           .Union(_dbContext.AllocationConfigOverrides.Select(x => x.DriverConfigGuid)).ToList();

            return driverConfigGuids;
        }

        public async Task UpdateStatisticDriversAsync(List<StatisticDriver> statisticDrivers, CancellationToken cancellationToken)
        {
            foreach (var statDriver in statisticDrivers.Where(d => d.DriverConfigGuid != Guid.Empty))
            {
                var driver = await _dbContext.DriverConfigs.Where(dc => dc.DriverConfigGuid == statDriver.DriverConfigGuid).FirstOrDefaultAsync();
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

                _dbContext.DriverConfigs.Add(driverConfig);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteStatisticDriversAsync(List<Guid> statisticDriverGuids, CancellationToken cancellationToken)
        {
            foreach (var statDriverGuid in statisticDriverGuids)
            {
                var driver = await _dbContext.DriverConfigs.Where(dc => dc.DriverConfigGuid == statDriverGuid).FirstOrDefaultAsync();
                _dbContext.Remove(driver);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
