using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{
    public interface IStatisticDriversService
    {
        public Task<StatisticDriverDTO> LoadStatisticDrivers(CostingConfig costingConfig);
    }
}

