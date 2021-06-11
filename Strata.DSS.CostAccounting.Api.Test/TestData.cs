using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Moq;
using Strata.CoreLib.Claims;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;
using Strata.DSS.CostAccounting.Client;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Test
{
    public static class TestData
    {
        private const string _aaEmail = "aaTestUser1@example.com";
        private const string _strataId = "10";

        public static Dictionary<string, string> GetConnectionConfig(string connectionString, bool isStrataUser = true)
        {
            var dict = new Dictionary<string, string> {
                { "connectionString", connectionString },
                { "isStrataUser", isStrataUser.ToString() }
            };
            return dict;
        }

        public static List<DriverConfig> GetDriverConfigs()
        {
            var statDriver = new DriverConfig()
            {
                Name = "TestStatisticDriver",
                MeasureGuid = Guid.NewGuid(),
                CostingType = Biz.Enums.CostingType.PatientCare
            };

            return new List<DriverConfig>() { statDriver };
        }

        public static List<DriverConfigView> GetDriverConfigViews()
        {
            var statDriver = new DriverConfigView()
            {
                Name = "TestStatisticDriver",
                MeasureGuid = Guid.NewGuid(),
                CostingType = Biz.Enums.CostingType.PatientCare
            };

            return new List<DriverConfigView>() { statDriver };
        }

        public static CostAccountingDbContext GetJazzSqlContext(SqliteConnection connection)
        {
            var optionsBuilder = new DbContextOptionsBuilder<CostAccountingDbContext>()
                .UseSqlite(connection)
                .EnableDetailedErrors()
                .EnableSensitiveDataLogging();
            var context = new CostAccountingDbContext(optionsBuilder.Options);
            context.Database.EnsureCreated();
            return context;
        }

        internal static async Task CreateData(CostAccountingDbContext jazzDbContext)
        {
            await jazzDbContext.Database.EnsureDeletedAsync();
            await jazzDbContext.Database.EnsureCreatedAsync();
            await jazzDbContext.DriverConfigs.AddRangeAsync(GetDriverConfigs());
            await jazzDbContext.DriverConfigViews.AddRangeAsync(GetDriverConfigViews());
            await jazzDbContext.SaveChangesAsync();
        }

        internal static ClaimsPrincipal GetClaimsPrincipal(bool isStrata = true)
        {
            var claims = new List<Claim> {
                new Claim(StrataClaims.DatabaseGuid, "7c9e6679-7425-40de-944b-e07fc1f90ae7"),
                new Claim(StrataClaims.StrataId, _strataId),
                new Claim(StrataClaims.Email, "testuser1@example.com"),
                new Claim(StrataClaims.Username, "testuser1"),
                new Claim(StrataClaims.AdvancedAnalyticsEmail, _aaEmail)
            };

            if (isStrata)
            {
                claims.Add(new Claim("scope", "strata.api.internal"));
            }

            var identity = new ClaimsIdentity(claims, "test");
            var principal = new ClaimsPrincipal(identity);

            return principal;
        }

        public static Mock<IStatisticDriversServiceClient> GetStatisticDriversServiceMock(bool accessAllowed)
        {
            var mockAaServiceClient = new Mock<IStatisticDriversServiceClient>();
            //mockAaServiceClient.Setup(a =>
            //    a.SaveStatisticDrivers($"{_aaEmail}_{_strataId}", It.IsAny<string>(),
            //        It.IsAny<CancellationToken>())).ReturnsAsync(accessAllowed);
            return mockAaServiceClient;
        }
    }
}
