using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Moq;
using NUnit.Framework;
using Strata.DSS.CostAccounting.Api.Controllers;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services;
using Strata.DSS.CostAccounting.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Test.UnitTests
{
    [TestFixture, Category("Unit")]
    public class StatisticDriversUnitTests : TestBase
    {
        [Test]
        public async Task TestGetStatisticDrivers()
        {
            var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var statDrivers = await controller.GetStatisticDrivers(CostingType.PatientCare, default);
            Assert.AreEqual(TestData.GetDriverConfigs().Count, statDrivers.Count());
        }

        [Test]
        public async Task TestGetDataSources()
        {
            var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var dataSources = controller.GetDataSources(CostingType.PatientCare);
            Assert.AreEqual(TestData.GetDataSources(CostingType.PatientCare).Count, dataSources.Count());
        }

        [Test]
        public async Task TestGetDataSourceLinks()
        {
            var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var dataSourceLinks = await controller.GetDataSourceLinks(CostingType.PatientCare, default);
            Assert.AreEqual(TestData.GetDataSourceLinks().Count, dataSourceLinks.Count());
        }

        [Test]
        public async Task TestSaveStatisticDrivers()
        {
            var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var statDriverSaveData = new StatisticDriverSaveData();
            statDriverSaveData.DeletedGuids = new List<Guid>() { new Guid("4014ab8a-13ab-4708-899d-4f6bc88033e6") };
            statDriverSaveData.Updated = new List<StatisticDriver>() {
                new StatisticDriver() {
                    Name = "New Statistic Driver",
                    DriverConfigGuid = Guid.Empty,
                    CostingType = CostingType.PatientCare,
                    MeasureGuid = new Guid("43dff3a4-1d1b-4645-bf8a-c093f0e83269") }
            };
            var statDrivers = await controller.SaveStatisticDrivers(statDriverSaveData, default);
            Assert.AreEqual(TestData.GetDriverConfigs().Count, ((IEnumerable<StatisticDriver>)((OkObjectResult)statDrivers.Result).Value).Count());
        }

        private async Task<(StatisticDriversController controller, Mock<IStatisticDriversServiceClient> statisticDriversServiceClient)>
            GetTestStatisticDriverController(SqliteConnection connection)
        {
            connection.Open();
            var costAccountingDbContext = TestData.GetJazzSqlContext(connection);
            await TestData.CreateData(costAccountingDbContext);

            var statisticDriversRepository = new StatisticDriversRepository(costAccountingDbContext);
            var costAccountingRepository = new Mock<ICostAccountingRepository>();
            costAccountingRepository.Setup(c => c.GetRuleSetsAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new List<RuleSet>());
            var listPatientCareGuids = new List<Guid>() {
                DataTableConstants.DSSGLGuid,
                DataTableConstants.PatientBillingLineItemDetailGuid,
                DataTableConstants.PatientEncounterSummaryGuid,
                DataTableConstants.CostingStatisticDriverGuid,
                DataTableConstants.StatisticDriverGuid,
                DataTableConstants.PayrollSampledGuid
            };
            costAccountingRepository.Setup(c => c.GetMeasuresAsync(listPatientCareGuids, It.IsAny<CancellationToken>())).ReturnsAsync(
                new List<Measure>() {
                    TestData.GetGLMeasure(),
                    TestData.GetSummaryMeasure(),
                    TestData.GetDollarsMeasure(),
                    TestData.GetHoursMeasure(),
                    TestData.GetUnitsMeasure()
                });
            costAccountingRepository.Setup(c => c.GetRuleEngineIncludedMeasuresAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new List<RuleEngineIncludedMeasure>());

            var statisticDriversService = new StatisticDriversService(costAccountingRepository.Object, statisticDriversRepository);
            var dataSourceService = new DataSourceService();
            var dataSourceLinkService = new DataSourceLinkService(costAccountingRepository.Object);

            var controller = new StatisticDriversController(statisticDriversRepository, statisticDriversService, dataSourceService, dataSourceLinkService);

            var statisticDriversServiceClient = new Mock<IStatisticDriversServiceClient>();

            return (controller, statisticDriversServiceClient);
        }
    }
}
