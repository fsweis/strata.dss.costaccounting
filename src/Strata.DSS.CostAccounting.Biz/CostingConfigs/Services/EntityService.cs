using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostingConfigs.Services
{
    public class EntityService : IEntityService
    {
        private readonly ICostingConfigRepository _costingConfigRepository;
        public EntityService(ICostingConfigRepository costingConfigRepository)
        {
            _costingConfigRepository = costingConfigRepository;

        }
        public async Task<IList<Entity>> GetEntities(CancellationToken cancellationToken)
        {
            var entities = await _costingConfigRepository.GetEntitiesAsync(cancellationToken);
            entities.First(x => x.Description == "Not Specified").Description = "All";
            entities = entities.OrderBy(x => x.SortOrder);
            return entities.ToList();
        }
        public async Task<IList<Entity>> GetFilteredEntities(CostingConfigModel costingConfig, bool isCostingEntityLevelSecurityEnabled, CancellationToken cancellationToken)
        {
            var entitiesToReturn = new List<Entity>();

            var entities = await _costingConfigRepository.GetEntitiesAsync(cancellationToken);
            entities.First(x => x.Description == "Not Specified").Description = "All";
            entities = entities.OrderBy(x => x.SortOrder);

            if (isCostingEntityLevelSecurityEnabled)
            {
                if (costingConfig == null)
                {
                    var noneEntity = new Entity
                    {
                        Description = "None"
                    };
                    entitiesToReturn.Add(noneEntity);
                }
                else
                {
                    var filteredEntities = await _costingConfigRepository.GetCCELSAsync(cancellationToken);
                    filteredEntities = filteredEntities.Where(x => x.CostingConfigGuid == costingConfig.CostingConfigGuid);
                    if (filteredEntities.Count() == 0)
                    {
                        var noneEntity = new Entity
                        {
                            Description = "None"
                        };
                        entitiesToReturn.Add(noneEntity);
                    }
                    else
                    {
                        entitiesToReturn = entities.Where(x => filteredEntities.Any(y => y.EntityId == x.EntityId)).ToList();
                    }
                }
            }
            else
            {
                entitiesToReturn = entities.ToList();
            }
            return entitiesToReturn;
        }
    }
}



