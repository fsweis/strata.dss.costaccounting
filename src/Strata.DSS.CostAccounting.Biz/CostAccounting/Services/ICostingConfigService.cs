using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.Services
{
    public interface ICostingConfigService
    {
        public Task<ConfigForm> AddNewConfig(ConfigForm configForm);
    }
}
