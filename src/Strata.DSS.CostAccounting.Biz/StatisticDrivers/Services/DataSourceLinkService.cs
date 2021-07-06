using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Constants;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{
    public class DataSourceLinkService : IDataSourceLinkService
    {
        private readonly ICostAccountingRepository _costAccountingRepository;
        public DataSourceLinkService(ICostAccountingRepository costaccountingRepository)
        {
            _costAccountingRepository = costaccountingRepository;

        }
        public async Task<IList<DataSourceLink>> GetDataSourceLinks(CostingType costingType, CancellationToken cancellationToken)
        {
            var measures = await _costAccountingRepository.GetMeasuresAsync(StatisticDriverDataSourceUtil.GetDataTableGuids(costingType == CostingType.Claims), cancellationToken);
            var ruleEngineIncludedMeasures = await _costAccountingRepository.GetRuleEngineIncludedMeasuresAsync(cancellationToken);

            var dataSourceLinks = new List<DataSourceLink>();
            //Load GL Sampled Measures
            var glSampledMeasures = measures.Where(x => x.DataTableGuid == DataTableConstants.DSSGLGuid && x.SQLColumnName == MeasureConstants.YTDDollarsMeasure);
            foreach (var measure in glSampledMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGuid, SDMeasureConstants.Dollars_FriendlyName, DataTableConstants.DSSGLGuid, true));
            }
            if (costingType == CostingType.PatientCare)
            {
                ConfigurePatientCareDataSourceLinks(measures, ruleEngineIncludedMeasures, dataSourceLinks);
            }
            else
            {
                ConfigureClaimsDataSourceLinks(measures, dataSourceLinks);
            }
            return dataSourceLinks.OrderBy(x => x.FriendlyName).ToList();
        }

        private static void ConfigurePatientCareDataSourceLinks(IList<CostAccounting.Models.Measure> measures, IList<CostAccounting.Models.RuleEngineIncludedMeasure> ruleEngineIncludedMeasures, List<DataSourceLink> dataSourceLinks)
        {
            //Load Encounter Summary Measures
            var summaryMeasure = measures.Single(x => x.DataTableGuid == DataTableConstants.PatientEncounterSummaryGuid && string.Equals(x.SQLColumnName, MeasureConstants.PES_EncounterRecordNumber_ColumnName));
            dataSourceLinks.Add(new DataSourceLink(summaryMeasure.MeasureGuid, SDMeasureConstants.Encounters_FriendlyName, DataTableConstants.PatientBillingLineItemDetailGuid, false));
            //Load Detail Table Measures
            var ruleEngineIncludedMeaureGuids = ruleEngineIncludedMeasures.Where(x => x.DataTableGuid == DataTableConstants.PatientBillingLineItemDetailGuid && x.IsIncludedInRules).Select(x => x.MeasureGuid).ToList();
            var detailMeasures = measures.Where(x => x.DataTableGuid == DataTableConstants.PatientBillingLineItemDetailGuid && ruleEngineIncludedMeaureGuids.Contains(x.MeasureGuid));
            foreach (var measure in detailMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGuid, measure.FriendlyName, measure.DataTableGuid, measure.SQLColumnName == MeasureConstants.UnitsOfServiceMeasure));
            }
            //Load Payroll Measures
            var dollarsMeasure = measures.Single(x => x.DataTableGuid == DataTableConstants.PayrollSampledGuid && string.Equals(x.SQLColumnName, MeasureConstants.YTDDollarsMeasure));
            var hoursMeasure = measures.Single(x => x.DataTableGuid == DataTableConstants.PayrollSampledGuid && string.Equals(x.SQLColumnName, MeasureConstants.YTDHoursMeasure));
            dataSourceLinks.Add(new DataSourceLink(dollarsMeasure.MeasureGuid, SDMeasureConstants.Dollars_FriendlyName, dollarsMeasure.DataTableGuid, true));
            dataSourceLinks.Add(new DataSourceLink(hoursMeasure.MeasureGuid, SDMeasureConstants.Hours_FriendlyName, hoursMeasure.DataTableGuid, true));
            //Load Statistics datasource & metrics 
            var unitsMeasure = measures.Single(x => x.DataTableGuid == DataTableConstants.StatisticDriverGuid && string.Equals(x.SQLColumnName, SDMeasureConstants.AmountCol_FriendlyName));
            dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGuid, SDMeasureConstants.Amount_FriendlyName, unitsMeasure.DataTableGuid, true));
            //Load GL/Payroll combined dummy datasourcelink
            var GL_PAYROLL_DATASOURCE_ID = new Guid(SDDataTableConstants.GL_PAYROLL_DATASOURCE_ID);
            dataSourceLinks.Add(new DataSourceLink(GL_PAYROLL_DATASOURCE_ID, SDMeasureConstants.Dollars_FriendlyName, GL_PAYROLL_DATASOURCE_ID, true));
        }

        private static void ConfigureClaimsDataSourceLinks(IList<CostAccounting.Models.Measure> measures, List<DataSourceLink> dataSourceLinks)
        {
            // Load Claim Summary Measure
            var claimsMeasure = measures.Single(x => x.DataTableGuid == DataTableConstants.PatientClaimSummaryGuid && string.Equals(x.SQLColumnName, MeasureConstants.PCS_ClaimRecordNumber_ColumnName));
            dataSourceLinks.Add(new DataSourceLink(claimsMeasure.MeasureGuid, SDMeasureConstants.Claims_FriendlyName, DataTableConstants.PatientClaimChargeLineItemDetailGuid, false));
            //Load Detail Table Measures
            var claimDetailMeasures = measures.Where(x => x.DataTableGuid == DataTableConstants.PatientClaimChargeLineItemDetailGuid && x.IsNumericMeasure()).ToList();
            foreach (var measure in claimDetailMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGuid, measure.FriendlyName, measure.DataTableGuid, false));
            }
            //Load Statistics datasource & metrics 
            var unitsMeasure = measures.Single(x => x.DataTableGuid == DataTableConstants.ClaimStatisticDriverGuid && string.Equals(x.SQLColumnName, SDMeasureConstants.AmountCol_FriendlyName));
            dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGuid, SDMeasureConstants.Amount_FriendlyName, unitsMeasure.DataTableGuid, true));
        }
    }
}
