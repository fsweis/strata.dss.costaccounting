using AutoMapper;
using Microsoft.Data.Sqlite;
using Moq;
using NUnit.Framework;
using Strata.CS;
using Strata.DSS.CostAccounting.Api.Controllers;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services;
using Strata.DSS.CostAccounting.Client;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using System.Linq;
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

            var statDrivers = await controller.GetStatisticDrivers(default);
            Assert.AreEqual(TestData.GetDriverConfigs().Count, statDrivers.Value.Count());
        }

        [Test]
        public async Task TestGetDataSources()
        {
            //TODO
            await using var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var statDrivers = await controller.GetDataSources(default);
            Assert.AreEqual(TestData.GetDriverConfigs().Count, statDrivers.Value.Count());
        }

        [Test]
        public async Task TestGetDataSourceLinks()
        {
            //TODO
            await using var connection = new SqliteConnection("Datasource=:memory:");
            var (controller, _) = await GetTestStatisticDriverController(connection);

            var statDrivers = await controller.GetDataSourceLinks(default);
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

        private async Task<(StatisticDriversController controller, Mock<IStatisticDriversServiceClient> sisenseServiceMock)>
            GetTestStatisticDriverController(SqliteConnection connection, bool accessAllowed = true)
        {
            connection.Open();
            var jazzDbContext = TestData.GetJazzSqlContext(connection);

            await TestData.CreateData(jazzDbContext);

            var costAccountingDbContextFactory = new Mock<IAsyncDbContextFactory<CostAccountingDbContext>>();

            var sisenseServiceMock = new Mock<IStatisticDriversServiceClient>();
            var claims = TestData.GetClaimsPrincipal();

            var statisticDriversRepository = new StatisticDriversRepository(costAccountingDbContextFactory.Object);
            var costAccountingRepository = new CostAccountingRepository(costAccountingDbContextFactory.Object);

            var mockMapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new CostAccountingProfile());
            });
            var mapper = mockMapper.CreateMapper();

            var costingConfigRepository = new CostingConfigRepository(mapper, costAccountingDbContextFactory.Object);
            var statisticDriversService = new StatisticDriversService(costAccountingRepository, statisticDriversRepository);
            var dataSourceService = new DataSourceService(costAccountingRepository);
            var dataSourceLinkService = new DataSourceLinkService(costAccountingRepository);

            var controller = new StatisticDriversController(statisticDriversRepository, statisticDriversService, costingConfigRepository, dataSourceService, dataSourceLinkService);

            return (controller, sisenseServiceMock);
        }
    }
}
