using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Moq;
using Strata.CoreLib.Claims;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Client;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.Test
{
    public static class TestData
    {
        public const int EXPECTED_MAPPINGS = 4;

        public const int TopicId1 = 100;
        public const int TopicId2 = 101;

        public const int TemplateId1 = 100;
        public const int TemplateId2 = 101;
        public const int TemplateIdNotFound = 999;

        public const int MappingId1 = 100;
        public const int MappingId2 = 101;
        public const int MappingId3 = 102;
        public const int MappingId4 = 103;

        public static Guid Solution1Guid = new Guid("a5255084-1432-4b17-a9fa-49e639c2e0fb");

        public static Guid Module1Guid = new Guid("e46853fa-5a3a-46df-b89f-6278c7755a31");
        public static Guid Module2Guid = new Guid("cf371f27-ce8c-45bb-9e8b-705d6243f1f7");

        public static string Dim1 = "[Dim.1]";
        public static string Dim2 = "[Dim.2]";
        public static string Dim3 = "[Dim.3]";
        public static string Dim4 = "[Dim.4]";
        public static string Dim5 = "[id.id]";
        public static string Dim6 = "[fake.dim]";

        public const string FileContents = "This is a dummy file";
        public const string UserId = "id";
        private static readonly List<string> _userGroups = new List<string> { "abc", "123" };
        private const string _datasourceName = "datasource1";
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
            //await jazzDbContext.SystemCenterSolution.AddRangeAsync(GetSolutions());
            //await jazzDbContext.SystemCenterModule.AddRangeAsync(GetModules());
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
