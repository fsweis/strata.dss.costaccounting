using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz;
using Strata.DSS.CostAccounting.Api.DTOs;

namespace Strata.DSS.CostAccounting.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{api-version:apiVersion}/[controller]")]
    public class StatisticDriversController:ControllerBase
    {
        private readonly ICostAccountingRepository _costaccountingRepository;

        public StatisticDriversController(ICostAccountingRepository costaccountingRepository)
        {
            _costaccountingRepository = costaccountingRepository;
        }

        [HttpGet("")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<StatisticDriverDTO>>> GetStatisticDrivers(CancellationToken cancellationToken)
        {
           
            var costingConfig = await _costaccountingRepository.GetCostingConfig(new Guid("da9eef04-3c9d-445b-b0c4-3a7812ca76d8"), cancellationToken);

            //////The following code will be moved into its own area, here for now to show what our provider/engine does
            var globalIds = new List<string>();
            globalIds.Add(DataTableConstants.DSSGL);
            if ((eCostingType)costingConfig.Type == eCostingType.Claims)
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
            
            //Get score data
            var dataTables = await _costaccountingRepository.GetDataTables(globalIds, cancellationToken);
            var measures = await _costaccountingRepository.GetMeasures(dataTables, cancellationToken);
            var ruleEngineIncludedMeaures = await _costaccountingRepository.GetRuleEngineIncludedMeasures(cancellationToken);

            //modify friendly names and get guids, bc thats what jazz does :( 
            var glSampledDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.DSSGL).FirstOrDefault();
            glSampledDataTable.FriendlyName = "GL";
            var glSampledDataTableGuid = glSampledDataTable.DataTableGUID;
            var detailDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientBillingLineItemDetail).FirstOrDefault();
            detailDataTable.FriendlyName = "Patient Detail";
            var detailDataTableGuid = detailDataTable.DataTableGUID;
            var payrollDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PayrollSampled).FirstOrDefault();
            payrollDataTable.FriendlyName = "Payroll";
            var payrollDataTableGuid = payrollDataTable.DataTableGUID;
            var statDriverDataTable= dataTables.Where(x => x.GlobalID == DataTableConstants.StatisticDriver).FirstOrDefault();
            statDriverDataTable.FriendlyName = "Statistics";
            var statDriverDataTableGuid = statDriverDataTable.DataTableGUID;
            var summaryDataTableGuid = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientEncounterSummary).Select(x => x.DataTableGUID).FirstOrDefault();
            var GL_PAYROLL_DATASOURCE_ID = new Guid("72533379-57ad-44c3-8365-b6187a0c6d48");
            //claims
            var claimDetailDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientClaimChargeLineItemDetail).FirstOrDefault();
            claimDetailDataTable.FriendlyName = "Claim Detail";
            var claimCostingStatisticDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.ClaimCostingStatisticDriver).FirstOrDefault();
            claimCostingStatisticDriverDataTable.FriendlyName = "Claims Statistics";
            var claimSummaryDataTableGuid = dataTables.Where(x => x.GlobalID == DataTableConstants.PatientClaimSummary).Select(x => x.DataTableGUID).FirstOrDefault();
            var claimStatisticDriverDataTable = dataTables.Where(x => x.GlobalID == DataTableConstants.ClaimStatisticDriver).FirstOrDefault();

            var dataSourceLinks = new List<DataSourceLink>();
            if ((eCostingType)costingConfig.Type != eCostingType.Claims)
            {
                //Load GL Sampled Measures
                var glSampledMeasures = measures.Where(x => x.DataTableGUID == glSampledDataTableGuid && x.SQLColumnName == MeasureConstants.YTDDollarsMeasure);
                foreach(var measure in glSampledMeasures)
                {
                    dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, "Dollars", glSampledDataTableGuid, true));
                }

                //Load Encounter Summary Measures
                var summaryMeasure = measures.Single(x => x.DataTableGUID==summaryDataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.PES_EncounterRecordNumber_ColumnName));
                dataSourceLinks.Add(new DataSourceLink(summaryMeasure.MeasureGUID, "Encounters", summaryMeasure.DataTableGUID, false));

                //Load Detail Table Measures
                var ruleEngineIncludedMeaureGuids = ruleEngineIncludedMeaures.Where(x=>x.DataTableGUID== detailDataTableGuid && x.IsIncludedInRules).Select(x => x.MeasureGUID).ToList();
                var detailMeasures = measures.Where(x => x.DataTableGUID == detailDataTableGuid && ruleEngineIncludedMeaureGuids.Contains(x.MeasureGUID));
                foreach (var measure in detailMeasures)
                {
                    dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID,measure.FriendlyName,measure.DataTableGUID, measure.SQLColumnName == MeasureConstants.UnitsOfServiceMeasure));
                }

                //Load Payroll Measures
                var dollarsMeasure = measures.Single(x => x.DataTableGUID == payrollDataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.YTDDollarsMeasure));
                var hoursMeasure =  measures.Single(x => x.DataTableGUID == payrollDataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.YTDHoursMeasure));
                dataSourceLinks.Add(new DataSourceLink(dollarsMeasure.MeasureGUID, "Dollars", dollarsMeasure.DataTableGUID, true));
                dataSourceLinks.Add(new DataSourceLink(hoursMeasure.MeasureGUID, "Hours", hoursMeasure.DataTableGUID, true));

                //Load Statistics datasource & metrics 
                var unitsMeasure = measures.Single(x => x.DataTableGUID== statDriverDataTableGuid && string.Equals(x.SQLColumnName, "Amount01"));
                dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGUID, "Amount", unitsMeasure.DataTableGUID, true));

                //Load GL/Payroll combined datasource & metrics 
                //create dummy score data table to insert into picker store  
                var glPDataTable = new DataTable() { DataTableGUID = GL_PAYROLL_DATASOURCE_ID, FriendlyName = "GL and Payroll", GlobalID = "GL and Payroll" };
                dataTables.Add(glPDataTable);
                dataSourceLinks.Add(new DataSourceLink(GL_PAYROLL_DATASOURCE_ID, "Dollars", GL_PAYROLL_DATASOURCE_ID, true));
            }
            else
            {
                //Load GL Sampled Measures
                var glSampledMeasures = measures.Where(x => x.DataTableGUID == glSampledDataTableGuid && x.SQLColumnName == MeasureConstants.YTDDollarsMeasure);
                foreach (var measure in glSampledMeasures)
                {
                    dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, "Dollars", glSampledDataTableGuid, true));
                }
                // Load Claim Summary Measure
                var claimsMeasure = measures.Single(x => x.DataTableGUID == claimSummaryDataTableGuid && string.Equals(x.SQLColumnName, MeasureConstants.PCS_ClaimRecordNumber_ColumnName));
                dataSourceLinks.Add(new DataSourceLink(claimsMeasure.MeasureGUID, "Claims", claimsMeasure.DataTableGUID, false));

                //Load Detail Table Measures
                var claimDetailMeasures = measures.Where(x => x.DataTableGUID == detailDataTableGuid).ToList(); //&& x.IsNumericMeasure).ToList();
                foreach (var measure in claimDetailMeasures)
                {
                    dataSourceLinks.Add(new DataSourceLink(measure.MeasureGUID, measure.FriendlyName, measure.DataTableGUID, false));
                }

                //Load Statistics datasource & metrics 
                var unitsMeasure = measures.Single(x => x.DataTableGUID == claimStatisticDriverDataTable.DataTableGUID && string.Equals(x.SQLColumnName, "Amount01"));
                dataSourceLinks.Add(new DataSourceLink(unitsMeasure.MeasureGUID, "Amount", unitsMeasure.DataTableGUID, true));
            }
            

            var driverConfigs = await _costaccountingRepository.GetStatisticDrivers(cancellationToken);
            var statisticDrivers = new List<StatisticDriver>();
           
            foreach (var driverConfigTemp in driverConfigs)
            {
                Guid dtGUID = Guid.Empty;
                if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID== glSampledDataTableGuid))
                {
                    dtGUID = glSampledDataTableGuid;
                }
                else if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == payrollDataTableGuid))
                {
                    dtGUID = payrollDataTableGuid;
                }
                else if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == statDriverDataTableGuid))
                    {
                    dtGUID = statDriverDataTableGuid;
                }
                else if (measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == detailDataTableGuid) ||
                         measures.Any(m => m.MeasureGUID == driverConfigTemp.MeasureGUID && m.DataTableGUID == summaryDataTableGuid))
                {
                    dtGUID = detailDataTableGuid;
                }
                else if (driverConfigTemp.MeasureGUID == GL_PAYROLL_DATASOURCE_ID) //gl & payroll
                {
                    dtGUID = GL_PAYROLL_DATASOURCE_ID;
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


                statisticDrivers.Add(new StatisticDriver(driverConfigTemp, dtGUID));
            }

            //Finally return dto
            var statisticDriverDto = new StatisticDriverDTO() { StatisticDrivers = statisticDrivers, DataSources = dataTables, DataSourceLinks = dataSourceLinks };
            return Ok(statisticDriverDto);
        }
    }
}
