using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{
    public class StatisticDriversService : IStatisticDriversService
    {
        private readonly ICostAccountingRepository _costAccountingRepository;
        private readonly IStatisticDriversRepository _statisticDriversRepository;

        public StatisticDriversService(ICostAccountingRepository costAccountingRepository, IStatisticDriversRepository statisticDriversRepository)
        {
            _costAccountingRepository = costAccountingRepository;
            _statisticDriversRepository = statisticDriversRepository;
        }

        public async Task<IList<StatisticDriver>> LoadStatisticDrivers(CostingType costingType, CancellationToken cancellationToken)
        {
            var driverConfigs = await _statisticDriversRepository.GetDriverConfigsAsync(costingType, cancellationToken);
            var ruleSets = await _costAccountingRepository.GetRuleSetsAsync(cancellationToken);
            var usedDriverConfigGuids = await _statisticDriversRepository.GetUsedDriverConfigs(cancellationToken);
            var statisticDrivers = new List<StatisticDriver>();
            var summaryGuid = costingType == CostingType.PatientCare ? DataTableConstants.PatientEncounterSummaryGuid : DataTableConstants.PatientClaimSummaryGuid;
            var detailDataTableGuid = costingType == CostingType.PatientCare ? DataTableConstants.PatientBillingLineItemDetailGuid : DataTableConstants.PatientClaimChargeLineItemDetailGuid;
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
