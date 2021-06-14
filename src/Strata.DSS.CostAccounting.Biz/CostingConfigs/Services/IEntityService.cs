using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    public interface IEntityService
    {
        public Task<IList<Entity>> GetEntities();

        public Task<IList<Entity>> GetFilteredEntities(CostingConfigModel costingConfig, bool isCostingEntityLevelSecurityEnabled);
    }
}
