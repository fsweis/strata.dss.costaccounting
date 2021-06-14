using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using NUnit.Framework;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.SMC.Client;
using Strata.SqlTools.Configuration.Common.AsyncFactory;
using Strata.SqlTools.Testing.Interceptors;
using Strata.Testing.Integration.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
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

            var factory = TestHost.GetAppFactory<Program, TestStartup>(TestData.GetConnectionConfig(ConnectionString), webBuilder => webBuilder.UseUrls("https://localhost:8443"),
                (typeof(IAsyncDbContextFactory<CostAccountingDbContext>), services => services.AddScoped(r => costAccountingDbContextFactory.Object)),
                (typeof(ISMCServiceClient), services => services.AddScoped(r => mockSmcServiceClient.Object)));
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
            await using var connection = new SqliteConnection("Datasource=:memory:");
            var client = await GetHttpClient(connection);

            var dataSources = await client.GetAsync("api/v1/statistic-drivers/data-sources?costingType=PatientCare").ToValue<List<DataTable>>();

            Assert.AreEqual(TestData.GetDataSources(CostingType.PatientCare).Count, dataSources.Count);
        }

        private async Task<HttpClient> GetHttpClient(SqliteConnection connection)
        {
            var server = await InitServer(connection);
            var projectDir = Directory.GetCurrentDirectory();
            var configPath = Path.Combine(projectDir, "appsettings.json");

            var client = server.WithWebHostBuilder(builder =>
            {
                builder.UseSolutionRelativeContentRoot(@"src\Strata.DSS.CostAccounting.Api");
                builder.ConfigureAppConfiguration((context, conf) =>
                {
                    conf.AddJsonFile(configPath);
                });
            }).CreateClient(new WebApplicationFactoryClientOptions() { BaseAddress = new Uri("https://localhost:8443") });
            return client;
        }
    }
}
