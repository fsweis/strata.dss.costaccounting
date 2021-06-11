using AutoMapper;
using Microsoft.Data.Sqlite;
using Moq;
using NUnit.Framework;
using Strata.CS;
using Strata.DSS.CostAccounting.Api.Controllers;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services;
using Strata.DSS.CostAccounting.Client;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
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
            await using var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var statDrivers = await controller.GetStatisticDrivers(CostingType.PatientCare, default);
            Assert.AreEqual(TestData.GetDriverConfigs().Count, statDrivers.Value.Count());
        }

        [Test]
        public async Task TestGetDataSources()
        {
            //TODO
            await using var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var statDrivers = controller.GetDataSources(CostingType.PatientCare);
            Assert.AreEqual(TestData.GetDriverConfigs().Count, statDrivers.Value.Count());
        }

        [Test]
        public async Task TestGetDataSourceLinks()
        {
            //TODO
            await using var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var statDrivers = await controller.GetDataSourceLinks(CostingType.PatientCare, default);
            Assert.AreEqual(TestData.GetDriverConfigs().Count, statDrivers.Value.Count());
        }

        [Test]
        public async Task TestSaveStatisticDrivers()
        {
            //TODO
            await using var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var statDriverSaveData = new StatisticDriverSaveData();
            var statDrivers = await controller.SaveStatisticDrivers(statDriverSaveData, default);
            Assert.AreEqual(TestData.GetDriverConfigs().Count, statDrivers.Value.Count());
        }

        private async Task<(StatisticDriversController controller, Mock<IStatisticDriversServiceClient> statisticDriversServiceClient)>
            GetTestStatisticDriverController(SqliteConnection connection)
        {
            connection.Open();
            var costAccountingDbContext = TestData.GetJazzSqlContext(connection);
            await TestData.CreateData(costAccountingDbContext);

            var costAccountingDbContextFactory = new Mock<IAsyncDbContextFactory<CostAccountingDbContext>>();
            costAccountingDbContextFactory.Setup(c => c.CreateDbContextAsync(It.IsAny<CancellationToken>())).ReturnsAsync(costAccountingDbContext);

            var statisticDriversRepository = new StatisticDriversRepository(costAccountingDbContextFactory.Object);
            var costAccountingRepository = new Mock<ICostAccountingRepository>();
            costAccountingRepository.Setup(c => c.GetRuleSetsAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new List<RuleSet>());

            var mockMapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new CostAccountingProfile());
            });
            var mapper = mockMapper.CreateMapper();

            var statisticDriversService = new StatisticDriversService(costAccountingRepository.Object, statisticDriversRepository);
            var costingConfigRepository = new CostingConfigRepository(mapper, costAccountingDbContextFactory.Object);
            var dataSourceService = new DataSourceService();
            var dataSourceLinkService = new DataSourceLinkService(costAccountingRepository.Object);

            var controller = new StatisticDriversController(statisticDriversRepository, statisticDriversService, costingConfigRepository, dataSourceService, dataSourceLinkService);

            var statisticDriversServiceClient = new Mock<IStatisticDriversServiceClient>();

            return (controller, statisticDriversServiceClient);
        }
    }
}
