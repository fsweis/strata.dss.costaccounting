
using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.CostComponents.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostComponents.Repositories
{
    public class CostComponentsRepository : ICostComponentsRepository
    {
        private readonly CostAccountingDbContext _dbContext;

        public CostComponentsRepository(CostAccountingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<CostComponentRollup>> GetCostComponentRollupsAsync(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var rollups = await _dbContext.CostComponentRollups.Where(cr => cr.CostComponentRollupGuid != Guid.Empty && cr.CostingConfigGuid == costingConfigGuid).OrderBy(dr => dr.Name).ToListAsync(cancellationToken);
            return rollups;
        }

        public async Task UpdateCostComponentRollupsAsync(List<CostComponentRollup> costComponentRollups, CancellationToken cancellationToken)
        {
            foreach (var costComponentRollup in costComponentRollups.Where(d => d.CostComponentRollupGuid != Guid.Empty))
            {
                var rollup = await _dbContext.CostComponentRollups.Where(dc => dc.CostComponentRollupGuid == costComponentRollup.CostComponentRollupGuid).FirstOrDefaultAsync();
                if (rollup != null)
                {
                    rollup.CostingConfigGuid = costComponentRollup.CostingConfigGuid;
                    rollup.IsExcluded = costComponentRollup.IsExcluded;
                    rollup.Name = costComponentRollup.Name;
                }
            }

            foreach (var newCostComponentRollup in costComponentRollups.Where(d => d.CostComponentRollupGuid == Guid.Empty))
            {
                var rollup = new CostComponentRollup()
                {
                    CostComponentRollupGuid = Guid.NewGuid(),
                    CostingConfigGuid = newCostComponentRollup.CostingConfigGuid,
                    IsExcluded = newCostComponentRollup.IsExcluded,
                    Name = newCostComponentRollup.Name
                };

                _dbContext.CostComponentRollups.Add(rollup);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteCostComponentRollupsAsync(List<Guid> costComponentRollupGuids, CancellationToken cancellationToken)
        {
            foreach (var costComponentRollupGuid in costComponentRollupGuids)
            {
                var driver = await _dbContext.CostComponentRollups.Where(cr => cr.CostComponentRollupGuid == costComponentRollupGuid).FirstOrDefaultAsync();
                _dbContext.Remove(driver);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
