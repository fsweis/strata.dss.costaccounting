using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Services
{
    public class CostingConfigService : ICostingConfigService
    {
        private readonly ICostingConfigRepository _costingConfigRepository;
        public CostingConfigService(ICostingConfigRepository costingConfigRepository)
        {
            _costingConfigRepository = costingConfigRepository;

        }

        public async Task<ConfigForm> AddNewConfig(ConfigForm configForm)
        {
            var configEntity =  await _costingConfigRepository.AddNewCostingConfigAsync(new CostingConfigModel(), default);
            return new ConfigForm();
        }
    }
}
