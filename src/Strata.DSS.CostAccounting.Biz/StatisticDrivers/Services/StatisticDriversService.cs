﻿using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
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
        public IList<DataTable> DataSources;
        public IList<DataSourceLink> DataSourceLinks;
        public IList<StatisticDriver> StatisticDrivers;

        private readonly ICostAccountingRepository _costaccountingRepository;
        private readonly IStatisticDriversRepository _statisticDriversRepository;

        private IList<DataTable> dataTables;
        private IList<Measure> measures;
        private IList<RuleEngineIncludedMeasure> ruleEngineIncludedMeaures;

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
            dataTables = await _costaccountingRepository.GetDataTablesAsync(globalIDs, default);
            measures = await _costaccountingRepository.GetMeasuresAsync(dataTables, default);
            ruleEngineIncludedMeaures = await _costaccountingRepository.GetRuleEngineIncludedMeasuresAsync(default);

            //Set the data sources 
            if (isClaims)
            {
                await SetClaimsDataSourcesAsync(costingConfig);
            }
            else
            {
                await SetDataSourcesAsync(costingConfig);
            }

            var statisticDriverDto = new StatisticDriverDTO()
            {
                StatisticDrivers = StatisticDrivers,
                DataSources = DataSources,
                DataSourceLinks = DataSourceLinks
            };
            return statisticDriverDto;
        }

        private IList<string> GetGlobalIDs(bool isClaims)
        {
            var globalIds = new List<string>();
            globalIds.Add(DataTableConstants.DSSGL);
            if (isClaims)
            {
                globalIds.Add(DataTableConstants.PatientClaimChargeLineItemDetail);
                //globalIds.Add(DataTableConstants.PatientClaimSummary);
                //globalIds.Add(DataTableConstants.ClaimCostingStatisticDriver);
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

        private async Task SetDataSourcesAsync(CostingConfig costingConfig)
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

            var driverConfigs = await _statisticDriversRepository.GetDriverConfigsAsync(costingConfig.Type, default);
            var usedDriverConfigGUIDs = await _statisticDriversRepository.GetUsedDriverConfigs(default);
            var statisticDrivers = new List<StatisticDriver>();

            foreach (var driverConfigTemp in driverConfigs)
            {
                var isUsed = false;
                if (usedDriverConfigGUIDs.Any(x => x == driverConfigTemp.DriverConfigGUID))
                {
                    isUsed = true;
                }
                statisticDrivers.Add(new StatisticDriver(driverConfigTemp, isUsed, summaryDataTableGuid, detailDataTable.DataTableGUID));
            }

            DataSources = dataTables;
            DataSourceLinks = dataSourceLinks;
            StatisticDrivers = statisticDrivers;

        }
        private async Task SetClaimsDataSourcesAsync(CostingConfig costingConfig)
        {
            var glSampledDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.DSSGL).FirstOrDefault();
            glSampledDataTable.FriendlyName = "GL";
            //claims
            var claimDetailDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientClaimChargeLineItemDetail).FirstOrDefault();
            claimDetailDataTable.FriendlyName = "Claim Detail";
            var claimCostingStatisticDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.ClaimCostingStatisticDriver).FirstOrDefault();
            var claimSummaryDataTableGuid = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientClaimSummary).Select(x => x.DataTableGUID).FirstOrDefault();
            var claimStatisticDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.ClaimStatisticDriver).FirstOrDefault();
            claimStatisticDriverDataTable.FriendlyName = "Claims Statistics";
            var dataSourceLinks = new List<DataSourceLink>();
            //Load GL Sampled Measures
            var glSampledMeasures = measures.Where(x => x.DataTableGUID == glSampledDataTable.DataTableGUID && x.SQLColumnName == MeasureConstants.YTDDollarsMeasure);
            foreach (var measure in glSampledMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, "Dollars", glSampledDataTable.DataTableGUID, true));
            }
            // Load Claim Summary Measure
            // var claimsMeasure = measures.Single(x => x.DataTableGUID == claimSummaryDataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.PCS_ClaimRecordNumber_ColumnName));
            // dataSourceLinks.Add(new DataSourceLink(claimsMeasure.MeasureGUID, "Claims", claimsMeasure.DataTableGUID, false));

            //Load Detail Table Measures
            var claimDetailMeasures = measures.Where(x => x.DataTableGUID == claimDetailDataTable.DataTableGUID && x.IsNumericMeasure()).ToList();
            foreach (var measure in claimDetailMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, measure.FriendlyName, measure.DataTableGUID, false));
            }

            //Load Statistics datasource & metrics 
            var unitsMeasure = measures.Single(x => x.DataTableGUID == claimStatisticDriverDataTable.DataTableGUID && string.Equals(x.SQLColumnName, "Amount01"));
            dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGUID, "Amount", unitsMeasure.DataTableGUID, true));

            var driverConfigs = await _statisticDriversRepository.GetDriverConfigsAsync(costingConfig.Type, default);
            var usedDriverConfigGUIDs = await _statisticDriversRepository.GetUsedDriverConfigs(default);
            var statisticDrivers = new List<StatisticDriver>();

            foreach (var driverConfigTemp in driverConfigs)
            {
                var isUsed = false;
                if(usedDriverConfigGUIDs.Any(x=>x ==driverConfigTemp.DriverConfigGUID))
                {
                    isUsed = true;
                }
                statisticDrivers.Add(new StatisticDriver(driverConfigTemp, isUsed, claimSummaryDataTableGuid, claimDetailDataTable.DataTableGUID));
            }

            DataSources = dataTables;
            DataSourceLinks = dataSourceLinks;
            StatisticDrivers = statisticDrivers;
        }
    }
}
