using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{
    public class StatisticDriversService : IStatisticDriversService
    {
        private readonly ICostAccountingRepository _costaccountingRepository;
        private readonly IStatisticDriversRepository _statisticDriversRepository;

        public StatisticDriversService(ICostAccountingRepository costaccountingRepository, IStatisticDriversRepository statisticDriversRepository)
        {
            _costaccountingRepository = costaccountingRepository;
            _statisticDriversRepository = statisticDriversRepository;
        }

        public async Task<IList<StatisticDriver>> LoadStatisticDrivers(CostingConfig costingConfig)
        {
            var driverConfigs = await _statisticDriversRepository.GetDriverConfigsAsync(costingConfig.Type, default);
            var ruleSets = await _costaccountingRepository.GetRuleSetssAsync(default);
            var usedDriverConfigGuids = await _statisticDriversRepository.GetUsedDriverConfigs(default);
            var statisticDrivers = new List<StatisticDriver>();
            var summaryGuid = costingConfig.Type == CostingType.PatientCare ? DataTableConstants.PatientEncounterSummaryGuid : DataTableConstants.PatientClaimSummaryGuid;
            var detailDataTableGuid = costingConfig.Type == CostingType.PatientCare ? DataTableConstants.PatientBillingLineItemDetailGuid : DataTableConstants.PatientClaimChargeLineItemDetailGuid;
            foreach (var driverConfigTemp in driverConfigs)
            {
                var isUsed = false;
                if (usedDriverConfigGuids.Any(x => x == driverConfigTemp.DriverConfigGuid))
                {
                    isUsed = true;
                }
                var hasRules = false;
                if (ruleSets.Any(x => x.Category.ToLower() == driverConfigTemp.DriverConfigGuid.ToString().ToLower()))
                {
                    hasRules = true;
                }
                statisticDrivers.Add(new StatisticDriver(driverConfigTemp, isUsed, hasRules, summaryGuid, detailDataTableGuid));
            }
            return statisticDrivers.OrderBy(x => x.Name).ToList();
        }
    }
}
