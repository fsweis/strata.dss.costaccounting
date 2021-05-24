using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Constants;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services
{
    public class StatisticDriversService: IStatisticDriversService
    {
        private readonly ICostAccountingRepository _costaccountingRepository;
        private readonly IStatisticDriversRepository _statisticDriversRepository;

        private DataTable glSampledDataTable;
        private DataTable detailDataTable;
        private DataTable payrollDataTable;
        private DataTable statDriverDataTable;
        private Guid summaryDataTableGuid;
        private Guid GL_PAYROLL_DATASOURCE_ID;
        //Claims
        private DataTable claimDetailDataTable;
        private DataTable claimCostingStatisticDriverDataTable;
        private Guid claimSummaryDataTableGuid;
        private DataTable claimStatisticDriverDataTable;

        public StatisticDriversService(ICostAccountingRepository costaccountingRepository, IStatisticDriversRepository statisticDriversRepository)
        {
            _costaccountingRepository = costaccountingRepository;
            _statisticDriversRepository = statisticDriversRepository;
        }
        public async Task<StatisticDriverDTO> LoadStatisticDrivers(CostingConfig costingConfig)
        {
            var isClaims = false;
            if ((CostingType)costingConfig.Type == CostingType.Claims)
            {
                isClaims = true;
            }
            //Get Data Tables for Costing Type
             var globalIDs = GetGlobalIDs(isClaims);

            //Get Score Data for those data tables
            var dataTables = await _costaccountingRepository.GetDataTablesAsync(globalIDs, default);
            var measures = await _costaccountingRepository.GetMeasuresAsync(dataTables, default);
            var ruleEngineIncludedMeasures = await _costaccountingRepository.GetRuleEngineIncludedMeasuresAsync(default);

            var statisticDriverDto = new StatisticDriverDTO()
            {
                DataSources = SetupDataSources(isClaims, dataTables),
                DataSourceLinks = SetupDataSourceLinks(isClaims, measures, ruleEngineIncludedMeasures),
                StatisticDrivers = await GetStatisticDriversAsync(costingConfig)
            };
            return statisticDriverDto;
        }

        private  IList<string> GetGlobalIDs(bool isClaims)
        {
            var globalIds = new List<string>();
            globalIds.Add(DataTableConstants.DSSGL);
            if (isClaims)
            {
                globalIds.Add(DataTableConstants.PatientClaimChargeLineItemDetail);
                globalIds.Add(DataTableConstants.PatientClaimSummary);
                globalIds.Add(DataTableConstants.ClaimCostingStatisticDriver);
                globalIds.Add(DataTableConstants.ClaimStatisticDriver);
            }
            else
            {
                globalIds.Add(DataTableConstants.PatientBillingLineItemDetail);
                globalIds.Add(DataTableConstants.PatientEncounterSummary);
                globalIds.Add(DataTableConstants.CostingStatisticDriver);
                globalIds.Add(DataTableConstants.StatisticDriver);
                globalIds.Add(DataTableConstants.PayrollSampled);
            }
            return globalIds;
        }

        private IList<DataTable> SetupDataSources(Boolean isClaims, IList<DataTable> dataTables)
        {
            var dataSources = new List<DataTable>();
            glSampledDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.DSSGL).FirstOrDefault();
            if (glSampledDataTable != null) glSampledDataTable.FriendlyName = SDDataTableConstants.DSSGL_FriendlyName;
            dataSources.Add(glSampledDataTable);

            if (!isClaims)
            {
                detailDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientBillingLineItemDetail).FirstOrDefault();
                if (detailDataTable != null)
                {
                    detailDataTable.FriendlyName = SDDataTableConstants.PBLID_FriendlyName;
                    dataSources.Add(detailDataTable);
                }
            
                payrollDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PayrollSampled).FirstOrDefault();
                if (payrollDataTable != null)
                {
                    payrollDataTable.FriendlyName = SDDataTableConstants.Payroll_FriendlyName;
                    dataSources.Add(payrollDataTable);
                }

                statDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.StatisticDriver).FirstOrDefault();
                if (statDriverDataTable != null)
                {
                    statDriverDataTable.FriendlyName = SDDataTableConstants.StatDriver_FriendlyName;
                    dataSources.Add(statDriverDataTable);
                }
            
                summaryDataTableGuid = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientEncounterSummary).Select(x => x.DataTableGuid).FirstOrDefault();

                GL_PAYROLL_DATASOURCE_ID = new Guid(SDDataTableConstants.GL_PAYROLL_DATASOURCE_ID);
                //Load GL/Payroll combined dummy datasource
                var glPDataTable = new DataTable() { DataTableGuid = GL_PAYROLL_DATASOURCE_ID, FriendlyName = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName, GlobalID = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName };
                dataSources.Add(glPDataTable);
            }
            else
            {
                //Claims
                claimDetailDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientClaimChargeLineItemDetail).FirstOrDefault();
                if (claimDetailDataTable != null)
                {
                    claimDetailDataTable.FriendlyName = SDDataTableConstants.ClaimDetail_FriendlyName;
                    dataSources.Add(claimDetailDataTable);
                }
                claimCostingStatisticDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.ClaimCostingStatisticDriver).FirstOrDefault();
                claimSummaryDataTableGuid = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientClaimSummary).Select(x => x.DataTableGuid).FirstOrDefault();
           
                claimStatisticDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.ClaimStatisticDriver).FirstOrDefault();
                if (claimStatisticDriverDataTable != null)
                {
                    claimStatisticDriverDataTable.FriendlyName = SDDataTableConstants.ClaimStatDriver_FriendlyName;
                    dataSources.Add(claimStatisticDriverDataTable);
                }
            }
            return dataSources.OrderBy(x=>x.FriendlyName).ToList();
        }

        private List<DataSourceLink> SetupDataSourceLinks(Boolean isClaims, IList<Measure>measures, IList<RuleEngineIncludedMeasure> ruleEngineIncludedMeasures)
        {
            var dataSourceLinks = new List<DataSourceLink>();
            //Load GL Sampled Measures
            var glSampledMeasures = measures.Where(x => x.DataTableGuid == glSampledDataTable.DataTableGuid && x.SQLColumnName == MeasureConstants.YTDDollarsMeasure);
            foreach (var measure in glSampledMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGuid, SDMeasureConstants.Dollars_FriendlyName, glSampledDataTable.DataTableGuid, true));
            }
            if(!isClaims)
            {
                //Load Encounter Summary Measures
                var summaryMeasure = measures.Single(x => x.DataTableGuid == summaryDataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.PES_EncounterRecordNumber_ColumnName));
                dataSourceLinks.Add(new DataSourceLink(summaryMeasure.MeasureGuid, SDMeasureConstants.Encounters_FriendlyName, detailDataTable.DataTableGuid, false));
                //Load Detail Table Measures
                var ruleEngineIncludedMeaureGuids = ruleEngineIncludedMeasures.Where(x => x.DataTableGuid == detailDataTable.DataTableGuid && x.IsIncludedInRules).Select(x => x.MeasureGuid).ToList();
                var detailMeasures = measures.Where(x => x.DataTableGuid == detailDataTable.DataTableGuid && ruleEngineIncludedMeaureGuids.Contains(x.MeasureGuid));
                foreach (var measure in detailMeasures)
                {
                    dataSourceLinks.Add(new DataSourceLink(measure.MeasureGuid, measure.FriendlyName, measure.DataTableGuid, measure.SQLColumnName == MeasureConstants.UnitsOfServiceMeasure));
                }
                //Load Payroll Measures
                var dollarsMeasure = measures.Single(x => x.DataTableGuid == payrollDataTable.DataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.YTDDollarsMeasure));
                var hoursMeasure = measures.Single(x => x.DataTableGuid == payrollDataTable.DataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.YTDHoursMeasure));
                dataSourceLinks.Add(new DataSourceLink(dollarsMeasure.MeasureGuid, SDMeasureConstants.Dollars_FriendlyName, dollarsMeasure.DataTableGuid, true));
                dataSourceLinks.Add(new DataSourceLink(hoursMeasure.MeasureGuid, SDMeasureConstants.Hours_FriendlyName, hoursMeasure.DataTableGuid, true));
                //Load Statistics datasource & metrics 
                var unitsMeasure = measures.Single(x => x.DataTableGuid == statDriverDataTable.DataTableGuid && string.Equals(x.SQLColumnName, SDMeasureConstants.AmountCol_FriendlyName));
                dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGuid, SDMeasureConstants.Amount_FriendlyName, unitsMeasure.DataTableGuid, true));
                //Load GL/Payroll combined dummy datasourcelink
                dataSourceLinks.Add(new DataSourceLink(GL_PAYROLL_DATASOURCE_ID, SDMeasureConstants.Dollars_FriendlyName, GL_PAYROLL_DATASOURCE_ID, true));
            }
            else
            {
                // Load Claim Summary Measure
                 var claimsMeasure = measures.Single(x => x.DataTableGuid == claimSummaryDataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.PCS_ClaimRecordNumber_ColumnName));
                 dataSourceLinks.Add(new DataSourceLink(claimsMeasure.MeasureGuid, SDMeasureConstants.Claims_FriendlyName, claimDetailDataTable.DataTableGuid, false));
                //Load Detail Table Measures
                var claimDetailMeasures = measures.Where(x => x.DataTableGuid == claimDetailDataTable.DataTableGuid && x.IsNumericMeasure()).ToList();
                foreach (var measure in claimDetailMeasures)
                {
                    dataSourceLinks.Add(new DataSourceLink(measure.MeasureGuid, measure.FriendlyName, measure.DataTableGuid, false));
                }
                //Load Statistics datasource & metrics 
                var unitsMeasure = measures.Single(x => x.DataTableGuid == claimStatisticDriverDataTable.DataTableGuid && string.Equals(x.SQLColumnName, SDMeasureConstants.AmountCol_FriendlyName));
                dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGuid, SDMeasureConstants.Amount_FriendlyName, unitsMeasure.DataTableGuid, true));
            }
            return dataSourceLinks.OrderBy(x => x.FriendlyName).ToList() ;
        }
        private async Task<List<StatisticDriver>> GetStatisticDriversAsync(CostingConfig costingConfig)
        {
            var driverConfigs = await _statisticDriversRepository.GetDriverConfigsAsync(costingConfig.Type, default);
            var usedDriverConfigGuids = await _statisticDriversRepository.GetUsedDriverConfigs(default);
            var statisticDrivers = new List<StatisticDriver>();
            var summaryGuid = costingConfig.Type == CostingType.PatientCare ? summaryDataTableGuid : claimSummaryDataTableGuid;
            var detailDataTableGuid = costingConfig.Type == CostingType.PatientCare ? detailDataTable.DataTableGuid : claimDetailDataTable.DataTableGuid;
            foreach (var driverConfigTemp in driverConfigs)
            {
                var isUsed = false;
                if (usedDriverConfigGuids.Any(x => x == driverConfigTemp.DriverConfigGuid))
                {
                    isUsed = true;
                }
                if(driverConfigTemp.Name=="fstest")
                {
                    Console.WriteLine("stop");
                }
                statisticDrivers.Add(new StatisticDriver(driverConfigTemp, isUsed, summaryGuid, detailDataTableGuid));
            }

            return statisticDrivers.OrderBy(x=>x.Name).ToList();
        }
    }
}
