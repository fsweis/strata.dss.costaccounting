using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    public interface IEntityService
    {
        public Task<IList<Entity>> GetEntities(CancellationToken cancellationToken);

        public Task<IList<Entity>> GetFilteredEntities(Guid costingConfigGuid, bool isCostingEntityLevelSecurityEnabled, CancellationToken cancellationToken);
    }
}
