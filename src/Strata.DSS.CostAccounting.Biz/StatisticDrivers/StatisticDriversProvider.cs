using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace Strata.DSS.CostAccounting.Biz.StatisticDrivers
{
    public class StatisticDriversProvider
    {
        public List<DataTable> DataSources;
        public List<DataSourceLink> DataSourceLinks;
        public List<StatisticDriver> StatisticDrivers;
        public bool IsClaims;
        private readonly ICostAccountingRepository _costaccountingRepository;
        private readonly IStatisticDriversRepository _statisticDriversRepository;
        private readonly CancellationToken _cancellationToken;
        public List<string> GlobalIDs;
        private List<DataTable> dataTables;
        private List<Measure> measures;
        private List<RuleEngineIncludedMeasure> ruleEngineIncludedMeaures;

        public StatisticDriversProvider(ICostAccountingRepository costaccountingRepository,IStatisticDriversRepository statisticDriversRepository, CancellationToken cancellationToken)
        {
            _costaccountingRepository = costaccountingRepository;
            _cancellationToken = cancellationToken;
        }
        public async void LoadStatisticDrivers(CostingConfig costingConfig)
        {
            if ((eCostingType)costingConfig.Type == eCostingType.Claims)
            {
                IsClaims = true;
            }
            else
            {
                IsClaims = false;
            }
            //////The following code will be moved into its own area, here for now to show what our provider/engine does

            GlobalIDs = GetGlobalIDs(IsClaims);
            //Get score data
            dataTables = await _costaccountingRepository.GetDataTables(GlobalIDs, _cancellationToken);
            measures = await _costaccountingRepository.GetMeasures(dataTables, _cancellationToken);
            ruleEngineIncludedMeaures = await _costaccountingRepository.GetRuleEngineIncludedMeasures(_cancellationToken);

            if(IsClaims)
            {
                SetClaimsDataSources();
            }
            else
            {
                SetDataSources();
            }

            //modify friendly names and get guids, bc thats what jazz does :( 
         


           

            var driverConfigs = await _statisticDriversRepository.GetStatisticDrivers(_cancellationToken);
            var statisticDrivers = new List<StatisticDriver>();
            /*
            foreach (var driverConfigTemp in driverConfigs)
            {
                Guid dtGUID = Guid.Empty;

                if (!IsClaims)
                {

                    if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == glSampledDataTable.DataTableGUID))
                    {
                        dtGUID = glSampledDataTable.DataTableGUID;
                    }
                    if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == payrollDataTable.DataTableGUID))
                    {
                        dtGUID = payrollDataTable.DataTableGUID;
                    }
                    else if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == statDriverDataTable.DataTableGUID))
                    {
                        dtGUID = statDriverDataTable.DataTableGUID;
                    }
                    else if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == detailDataTable.DataTableGUID) ||
                             measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == summaryDataTableGuid))
                    {
                        dtGUID = detailDataTable.DataTableGUID;
                    }
                    else if (driverConfigTemp.MeasureGUID == GL_PAYROLL_DATASOURCE_ID) //gl & payroll
                    {
                        dtGUID = GL_PAYROLL_DATASOURCE_ID;
                    }
                }
                else
                {
                    if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == glSampledDataTable.DataTableGUID))
                    {
                        dtGUID = glSampledDataTable.DataTableGUID;
                    }
                    else if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == claimStatisticDriverDataTable.DataTableGUID))
                    {
                        dtGUID = claimStatisticDriverDataTable.DataTableGUID;
                    }
                    else if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == claimDetailDataTable.DataTableGUID) ||
                            measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == claimSummaryDataTableGuid))
                    {
                        dtGUID = claimDetailDataTable.DataTableGUID;
                    }
                }
            

                statisticDrivers.Add(new StatisticDriver(driverConfigTemp, dtGUID));
            }
            */

        }
        public List<string> GetGlobalIDs(bool isClaims)
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
        public void SetDataSources()
        {
            var glSampledDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.DSSGL).FirstOrDefault();
            glSampledDataTable.FriendlyName = "GL";
            var detailDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientBillingLineItemDetail).FirstOrDefault();
            detailDataTable.FriendlyName = "Patient Detail";
            var payrollDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PayrollSampled).FirstOrDefault();
            payrollDataTable.FriendlyName = "Payroll";
            var statDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.StatisticDriver).FirstOrDefault();
            statDriverDataTable.FriendlyName = "Statistics";
            var summaryDataTableGuid = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientEncounterSummary).Select(x => x.DataTableGUID).FirstOrDefault();
            var GL_PAYROLL_DATASOURCE_ID = new Guid("72533379-57ad-44c3-8365-b6187a0c6d48");

            var dataSourceLinks = new List<DataSourceLink>();
            //Load GL Sampled Measures
            var glSampledMeasures = measures.Where(x => x.DataTableGUID == glSampledDataTable.DataTableGUID && x.SQLColumnName == MeasureConstants.YTDDollarsMeasure);
            foreach (var measure in glSampledMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, "Dollars", glSampledDataTable.DataTableGUID, true));
            }

            //Load Encounter Summary Measures
            var summaryMeasure = measures.Single(x => x.DataTableGUID == summaryDataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.PES_EncounterRecordNumber_ColumnName));
            dataSourceLinks.Add(new DataSourceLink(summaryMeasure.MeasureGUID, "Encounters", summaryMeasure.DataTableGUID, false));

            //Load Detail Table Measures
            var ruleEngineIncludedMeaureGuids = ruleEngineIncludedMeaures.Where(x => x.DataTableGUID == detailDataTable.DataTableGUID && x.IsIncludedInRules).Select(x => x.MeasureGUID).ToList();
            var detailMeasures = measures.Where(x => x.DataTableGUID == detailDataTable.DataTableGUID && ruleEngineIncludedMeaureGuids.Contains(x.MeasureGUID));
            foreach (var measure in detailMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, measure.FriendlyName, measure.DataTableGUID, measure.SQLColumnName == MeasureConstants.UnitsOfServiceMeasure));
            }

            //Load Payroll Measures
            var dollarsMeasure = measures.Single(x => x.DataTableGUID == payrollDataTable.DataTableGUID && string.Equals(x.SQLColumnName, MeasureConstants.YTDDollarsMeasure));
            var hoursMeasure = measures.Single(x => x.DataTableGUID == payrollDataTable.DataTableGUID && string.Equals(x.SQLColumnName, MeasureConstants.YTDHoursMeasure));
            dataSourceLinks.Add(new DataSourceLink(dollarsMeasure.MeasureGUID, "Dollars", dollarsMeasure.DataTableGUID, true));
            dataSourceLinks.Add(new DataSourceLink(hoursMeasure.MeasureGUID, "Hours", hoursMeasure.DataTableGUID, true));

            //Load Statistics datasource & metrics 
            var unitsMeasure = measures.Single(x => x.DataTableGUID == statDriverDataTable.DataTableGUID && string.Equals(x.SQLColumnName, "Amount01"));
            dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGUID, "Amount", unitsMeasure.DataTableGUID, true));

            //Load GL/Payroll combined datasource & metrics 
            //create dummy score data table to insert into picker store  
            var glPDataTable = new DataTable() { DataTableGUID = GL_PAYROLL_DATASOURCE_ID, FriendlyName = "GL and Payroll", GlobalID = "GL and Payroll" };
            dataTables.Add(glPDataTable);
            dataSourceLinks.Add(new DataSourceLink(GL_PAYROLL_DATASOURCE_ID, "Dollars", GL_PAYROLL_DATASOURCE_ID, true));
        }
        public void SetClaimsDataSources()
        {
            var glSampledDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.DSSGL).FirstOrDefault();
            glSampledDataTable.FriendlyName = "GL";
            //claims
            var claimDetailDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientClaimChargeLineItemDetail).FirstOrDefault();
            claimDetailDataTable.FriendlyName = "Claim Detail";
            var claimCostingStatisticDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.ClaimCostingStatisticDriver).FirstOrDefault();
            claimCostingStatisticDriverDataTable.FriendlyName = "Claims Statistics";
            var claimSummaryDataTableGuid = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientClaimSummary).Select(x => x.DataTableGUID).FirstOrDefault();
            var claimStatisticDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.ClaimStatisticDriver).FirstOrDefault();
            var dataSourceLinks = new List<DataSourceLink>();
            //Load GL Sampled Measures
            var glSampledMeasures = measures.Where(x => x.DataTableGUID == glSampledDataTable.DataTableGUID && x.SQLColumnName == MeasureConstants.YTDDollarsMeasure);
            foreach (var measure in glSampledMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, "Dollars", glSampledDataTable.DataTableGUID, true));
            }
            // Load Claim Summary Measure
            var claimsMeasure = measures.Single(x => x.DataTableGUID == claimSummaryDataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.PCS_ClaimRecordNumber_ColumnName));
            dataSourceLinks.Add(new DataSourceLink(claimsMeasure.MeasureGUID, "Claims", claimsMeasure.DataTableGUID, false));

            //Load Detail Table Measures
            var claimDetailMeasures = measures.Where(x => x.DataTableGUID == claimDetailDataTable.DataTableGUID).ToList(); //&& x.IsNumericMeasure).ToList();
            foreach (var measure in claimDetailMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, measure.FriendlyName, measure.DataTableGUID, false));
            }

            //Load Statistics datasource & metrics 
            var unitsMeasure = measures.Single(x => x.DataTableGUID == claimStatisticDriverDataTable.DataTableGUID && string.Equals(x.SQLColumnName, "Amount01"));
            dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGUID, "Amount", unitsMeasure.DataTableGUID, true));
        }
    }
}
