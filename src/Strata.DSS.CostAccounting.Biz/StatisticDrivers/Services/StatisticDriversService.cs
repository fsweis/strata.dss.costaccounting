﻿using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
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
        private Guid summaryDataTableGUID;
        private Guid GL_PAYROLL_DATASOURCE_ID;
        //Claims
        private DataTable claimDetailDataTable;
        private DataTable claimCostingStatisticDriverDataTable;
        private Guid claimSummaryDataTableGUID;
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
            
                summaryDataTableGUID = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientEncounterSummary).Select(x => x.DataTableGUID).FirstOrDefault();

                GL_PAYROLL_DATASOURCE_ID = new Guid(SDDataTableConstants.GL_PAYROLL_DATASOURCE_ID);
                //Load GL/Payroll combined dummy datasource
                var glPDataTable = new DataTable() { DataTableGUID = GL_PAYROLL_DATASOURCE_ID, FriendlyName = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName, GlobalID = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName };
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
                claimSummaryDataTableGUID = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientClaimSummary).Select(x => x.DataTableGUID).FirstOrDefault();
           
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
            var glSampledMeasures = measures.Where(x => x.DataTableGUID == glSampledDataTable.DataTableGUID && x.SQLColumnName == MeasureConstants.YTDDollarsMeasure);
            foreach (var measure in glSampledMeasures)
            {
                dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, SDMeasureConstants.Dollars_FriendlyName, glSampledDataTable.DataTableGUID, true));
            }
            if(!isClaims)
            {
                //Load Encounter Summary Measures
                var summaryMeasure = measures.Single(x => x.DataTableGUID == summaryDataTableGUID && string.Equals(x.SQLColumnName, MeasureConstants.PES_EncounterRecordNumber_ColumnName));
                dataSourceLinks.Add(new DataSourceLink(summaryMeasure.MeasureGUID, SDMeasureConstants.Encounters_FriendlyName, detailDataTable.DataTableGUID, false));
                //Load Detail Table Measures
                var ruleEngineIncludedMeaureGuids = ruleEngineIncludedMeasures.Where(x => x.DataTableGUID == detailDataTable.DataTableGUID && x.IsIncludedInRules).Select(x => x.MeasureGUID).ToList();
                var detailMeasures = measures.Where(x => x.DataTableGUID == detailDataTable.DataTableGUID && ruleEngineIncludedMeaureGuids.Contains(x.MeasureGUID));
                foreach (var measure in detailMeasures)
                {
                    dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, measure.FriendlyName, measure.DataTableGUID, measure.SQLColumnName == MeasureConstants.UnitsOfServiceMeasure));
                }
                //Load Payroll Measures
                var dollarsMeasure = measures.Single(x => x.DataTableGUID == payrollDataTable.DataTableGUID && string.Equals(x.SQLColumnName, MeasureConstants.YTDDollarsMeasure));
                var hoursMeasure = measures.Single(x => x.DataTableGUID == payrollDataTable.DataTableGUID && string.Equals(x.SQLColumnName, MeasureConstants.YTDHoursMeasure));
                dataSourceLinks.Add(new DataSourceLink(dollarsMeasure.MeasureGUID, SDMeasureConstants.Dollars_FriendlyName, dollarsMeasure.DataTableGUID, true));
                dataSourceLinks.Add(new DataSourceLink(hoursMeasure.MeasureGUID, SDMeasureConstants.Hours_FriendlyName, hoursMeasure.DataTableGUID, true));
                //Load Statistics datasource & metrics 
                var unitsMeasure = measures.Single(x => x.DataTableGUID == statDriverDataTable.DataTableGUID && string.Equals(x.SQLColumnName, SDMeasureConstants.AmountCol_FriendlyName));
                dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGUID, SDMeasureConstants.Amount_FriendlyName, unitsMeasure.DataTableGUID, true));
                //Load GL/Payroll combined dummy datasourcelink
                dataSourceLinks.Add(new DataSourceLink(GL_PAYROLL_DATASOURCE_ID, SDMeasureConstants.Dollars_FriendlyName, GL_PAYROLL_DATASOURCE_ID, true));
            }
            else
            {
                // Load Claim Summary Measure
                 var claimsMeasure = measures.Single(x => x.DataTableGUID == claimSummaryDataTableGUID && string.Equals(x.SQLColumnName, MeasureConstants.PCS_ClaimRecordNumber_ColumnName));
                 dataSourceLinks.Add(new DataSourceLink(claimsMeasure.MeasureGUID, SDMeasureConstants.Claims_FriendlyName, claimDetailDataTable.DataTableGUID, false));
                //Load Detail Table Measures
                var claimDetailMeasures = measures.Where(x => x.DataTableGUID == claimDetailDataTable.DataTableGUID && x.IsNumericMeasure()).ToList();
                foreach (var measure in claimDetailMeasures)
                {
                    dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, measure.FriendlyName, measure.DataTableGUID, false));
                }
                //Load Statistics datasource & metrics 
                var unitsMeasure = measures.Single(x => x.DataTableGUID == claimStatisticDriverDataTable.DataTableGUID && string.Equals(x.SQLColumnName, SDMeasureConstants.AmountCol_FriendlyName));
                dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGUID, SDMeasureConstants.Amount_FriendlyName, unitsMeasure.DataTableGUID, true));
            }
            return dataSourceLinks.OrderBy(x => x.FriendlyName).ToList() ;
        }
        private async Task<List<StatisticDriver>> GetStatisticDriversAsync(CostingConfig costingConfig)
        {
            var driverConfigs = await _statisticDriversRepository.GetDriverConfigsAsync(costingConfig.Type, default);
            var usedDriverConfigGUIDs = await _statisticDriversRepository.GetUsedDriverConfigs(default);
            var statisticDrivers = new List<StatisticDriver>();
            var summaryGUID = costingConfig.Type == CostingType.PatientCare ? summaryDataTableGUID : claimSummaryDataTableGUID;
            var detailDataTableGUID = costingConfig.Type == CostingType.PatientCare ? detailDataTable.DataTableGUID : claimDetailDataTable.DataTableGUID;
            foreach (var driverConfigTemp in driverConfigs)
            {
                var isUsed = false;
                if (usedDriverConfigGUIDs.Any(x => x == driverConfigTemp.DriverConfigGUID))
                {
                    isUsed = true;
                }
                
                statisticDrivers.Add(new StatisticDriver(driverConfigTemp, isUsed, summaryDataTableGUID, detailDataTableGUID));
            }

            return statisticDrivers.OrderBy(x=>x.Name).ToList();
        }
    }
}
