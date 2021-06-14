using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using NUnit.Framework;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.SMC.Client;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using Strata.SqlTools.Testing.Interceptors;
using Strata.Testing.Integration.Hosting;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Test.IntegrationTests
{
    public class StatisticDriversIntegrationTests : TestBase
    {
        private QueryCountInterceptor _interceptor;

        private async Task<WebApplicationFactory<Program>> InitServer(SqliteConnection connection)
        {
            _interceptor = new QueryCountInterceptor(true);
            connection.Open();
            var costAccountingDbContext = TestData.GetJazzSqlContext(connection);
            await TestData.CreateData(costAccountingDbContext);

            var costAccountingDbContextFactory = new Mock<IAsyncDbContextFactory<CostAccountingDbContext>>();
            costAccountingDbContextFactory.Setup(c => c.CreateDbContextAsync(It.IsAny<CancellationToken>())).ReturnsAsync(costAccountingDbContext);

            var db = new StrataSensitiveDatabaseDto { DatabaseGUID = new Guid("7c9e6679-7425-40de-944b-e07fc1f90ae7") };
            var mockSmcServiceClient = new Mock<ISMCServiceClient>();
            mockSmcServiceClient.Setup(c => c.GetDatabaseAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync(db);

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

            var factory = TestHost.GetAppFactory<Program, TestStartup>(TestData.GetConnectionConfig(ConnectionString), null,
                (typeof(IAsyncDbContextFactory<CostAccountingDbContext>), services => services.AddScoped(r => costAccountingDbContextFactory.Object)),
                (typeof(ISMCServiceClient), services => services.AddScoped(r => mockSmcServiceClient.Object)),
                (typeof(ICostAccountingRepository), services => services.AddScoped(r => costAccountingRepository.Object)));
            return factory;
        }

        [TearDown]
        public void Teardown()
        {
            // Reset stored queries
            _interceptor.Clear();
        }

        [Test]
        public async Task TestGetDataSources()
        {
            var connection = new SqliteConnection("Datasource=:memory:");
            var client = await GetHttpClient(connection);

            var dataSources = await client.GetAsync("api/v1/statistic-drivers/data-sources?costingType=PatientCare").ToValue<List<DataTable>>();

            Assert.AreEqual(TestData.GetDataSources(CostingType.PatientCare).Count, dataSources.Count);
        }

        [Test]
        public async Task TestGetDataSourceLinks()
        {
            var connection = new SqliteConnection("Datasource=:memory:");
            var client = await GetHttpClient(connection);

            var dataSourceLinks = await client.GetAsync("api/v1/statistic-drivers/data-source-links?costingType=PatientCare").ToValue<List<DataSourceLink>>();

            Assert.AreEqual(TestData.GetDataSourceLinks().Count, dataSourceLinks.Count);
        }

        [Test]
        public async Task TestGetStatisticDrivers()
        {
            var connection = new SqliteConnection("Datasource=:memory:");
            var client = await GetHttpClient(connection);

            var dataSources = await client.GetAsync("api/v1/statistic-drivers?costingType=PatientCare").ToValue<List<StatisticDriver>>();

            Assert.AreEqual(TestData.GetDriverConfigs().Count, dataSources.Count);
        }

        private async Task<HttpClient> GetHttpClient(SqliteConnection connection)
        {
            var server = await InitServer(connection);

            var client = server.CreateClient();
            return client;
        }
    }
}
