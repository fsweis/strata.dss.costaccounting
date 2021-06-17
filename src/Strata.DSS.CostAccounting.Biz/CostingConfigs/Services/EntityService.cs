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
        private readonly ICostAccountingRepository _costAccountingRepository;
        public EntityService(ICostingConfigRepository costingConfigRepository, ICostAccountingRepository costAccountingRepository)
        {
            _costingConfigRepository = costingConfigRepository;
            _costAccountingRepository = costAccountingRepository;
        }
        public async Task<IList<Entity>> GetEntities(CancellationToken cancellationToken)
        {
            var entities = await _costAccountingRepository.GetEntitiesAsync(cancellationToken);
            entities.First(x => x.Description == "Not Specified").Description = "All";
            entities = entities.OrderBy(x => x.SortOrder);
            return entities.ToList();
        }
        public async Task<IList<Entity>> GetFilteredEntities(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var entitiesToReturn = new List<Entity>();

            var entities = await _costAccountingRepository.GetEntitiesAsync(cancellationToken);
            entities.First(x => x.Description == "Not Specified").Description = "All";
            entities = entities.OrderBy(x => x.SortOrder);

            if (costingConfigGuid == null || costingConfigGuid == Guid.Empty)
            {
                var noneEntity = new Entity
                {
                    Description = "None"
                };
                entitiesToReturn.Add(noneEntity);
            }
            else
            {
                var filteredEntities = await _costingConfigRepository.GetCCELSAsync(costingConfigGuid, cancellationToken);
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


            return entitiesToReturn;
        }
    }
}



