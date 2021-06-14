using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Moq;
using Strata.CoreLib.Claims;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Constants;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Constants;
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
                { "isStrataUser", isStrataUser.ToString() },
                { "contentRoot", @"C:\Git\strata.dss.costaccounting\src\Strata.DSS.CostAccounting.Api"}
            };
            return dict;
        }

        public static List<DriverConfig> GetDriverConfigs()
        {
            var statDriver = new DriverConfig()
            {
                Name = "TestStatisticDriver",
                DriverConfigGuid = new Guid("4014ab8a-13ab-4708-899d-4f6bc88033e6"),
                MeasureGuid = new Guid("d33709b1-e53b-4c54-b606-d647fdcad52e"),
                CostingType = CostingType.PatientCare
            };

            var statDriver2 = new DriverConfig()
            {
                Name = "TestStatisticDriver2",
                DriverConfigGuid = new Guid("f5177bdd-298d-4b66-b6b3-73dff3249ee7"),
                MeasureGuid = new Guid("6f322ca6-7b21-4498-9457-fb0654c3872e"),
                CostingType = CostingType.PatientCare
            };

            return new List<DriverConfig>() { statDriver, statDriver2 };
        }

        public static List<DriverConfigView> GetDriverConfigViews()
        {
            var statDriver = new DriverConfigView()
            {
                Name = "TestStatisticDriver",
                DriverConfigGuid = new Guid("4014ab8a-13ab-4708-899d-4f6bc88033e6"),
                MeasureGuid = new Guid("d33709b1-e53b-4c54-b606-d647fdcad52e"),
                DataTableGuid = DataTableConstants.DSSGLGuid,
                CostingType = CostingType.PatientCare
            };

            var statDriver2 = new DriverConfigView()
            {
                Name = "TestStatisticDriver2",
                DriverConfigGuid = new Guid("f5177bdd-298d-4b66-b6b3-73dff3249ee7"),
                MeasureGuid = new Guid("6f322ca6-7b21-4498-9457-fb0654c3872e"),
                DataTableGuid = DataTableConstants.PatientEncounterSummaryGuid,
                CostingType = CostingType.PatientCare
            };

            return new List<DriverConfigView>() { statDriver, statDriver2 };
        }

        internal static List<DataTable> GetDataSources(CostingType costingType)
        {
            var dataSources = new List<DataTable>();
            var glSampledDataTable = new DataTable() { DataTableGuid = DataTableConstants.DSSGLGuid, GlobalID = DataTableConstants.DSSGL, FriendlyName = SDDataTableConstants.DSSGL_FriendlyName };
            dataSources.Add(glSampledDataTable);

            if (costingType == CostingType.PatientCare)
            {
                var detailDataTable = new DataTable() { DataTableGuid = DataTableConstants.PatientBillingLineItemDetailGuid, GlobalID = DataTableConstants.PatientBillingLineItemDetail, FriendlyName = SDDataTableConstants.PBLID_FriendlyName };
                dataSources.Add(detailDataTable);
                var payrollDataTable = new DataTable() { DataTableGuid = DataTableConstants.PayrollSampledGuid, GlobalID = DataTableConstants.PayrollSampled, FriendlyName = SDDataTableConstants.Payroll_FriendlyName };
                dataSources.Add(payrollDataTable);
                var statDriverDataTable = new DataTable() { DataTableGuid = DataTableConstants.StatisticDriverGuid, GlobalID = DataTableConstants.StatisticDriver, FriendlyName = SDDataTableConstants.StatDriver_FriendlyName };
                dataSources.Add(statDriverDataTable);
                var GL_PAYROLL_DATASOURCE_ID = new Guid(SDDataTableConstants.GL_PAYROLL_DATASOURCE_ID);
                var glPDataTable = new DataTable() { DataTableGuid = GL_PAYROLL_DATASOURCE_ID, FriendlyName = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName, GlobalID = SDDataTableConstants.GL_PAYROLL_DATASOURCE_FriendlyName };
                dataSources.Add(glPDataTable);
            }
            else
            {
                var claimDetailDataTable = new DataTable() { DataTableGuid = DataTableConstants.PatientClaimChargeLineItemDetailGuid, GlobalID = DataTableConstants.PatientClaimChargeLineItemDetail, FriendlyName = SDDataTableConstants.ClaimDetail_FriendlyName };
                dataSources.Add(claimDetailDataTable);

                var claimStatisticDriverDataTable = new DataTable() { DataTableGuid = DataTableConstants.ClaimStatisticDriverGuid, GlobalID = DataTableConstants.ClaimStatisticDriver, FriendlyName = SDDataTableConstants.ClaimStatDriver_FriendlyName };
                dataSources.Add(claimStatisticDriverDataTable);
            }

            return dataSources;
        }

        internal static List<DataSourceLink> GetDataSourceLinks()
        {
            var dataSourceLinks = new List<DataSourceLink>();

            var glMeasure = GetGLMeasure();
            var glDataSourceLink = new DataSourceLink(glMeasure.MeasureGuid, SDMeasureConstants.Dollars_FriendlyName, glMeasure.DataTableGuid, true);
            dataSourceLinks.Add(glDataSourceLink);

            var summaryMeasure = GetSummaryMeasure();
            var summaryDataSourceLink = new DataSourceLink(summaryMeasure.MeasureGuid, SDMeasureConstants.Encounters_FriendlyName, DataTableConstants.PatientBillingLineItemDetailGuid, false);
            dataSourceLinks.Add(summaryDataSourceLink);

            var dollarsMeasure = GetDollarsMeasure();
            var dollarsDataSourceLink = new DataSourceLink(dollarsMeasure.MeasureGuid, SDMeasureConstants.Dollars_FriendlyName, dollarsMeasure.DataTableGuid, false);
            dataSourceLinks.Add(dollarsDataSourceLink);

            var hoursMeasure = GetDollarsMeasure();
            var hoursDataSourceLink = new DataSourceLink(hoursMeasure.MeasureGuid, SDMeasureConstants.Hours_FriendlyName, hoursMeasure.DataTableGuid, false);
            dataSourceLinks.Add(hoursDataSourceLink);

            var unitsMeasure = GetDollarsMeasure();
            var unitsDataSourceLink = new DataSourceLink(unitsMeasure.MeasureGuid, unitsMeasure.FriendlyName, unitsMeasure.DataTableGuid, false);
            dataSourceLinks.Add(unitsDataSourceLink);

            var GL_PAYROLL_DATASOURCE_ID = new Guid(SDDataTableConstants.GL_PAYROLL_DATASOURCE_ID);
            var glPayrollDataSourceLink = new DataSourceLink(GL_PAYROLL_DATASOURCE_ID, SDMeasureConstants.Dollars_FriendlyName, GL_PAYROLL_DATASOURCE_ID, true);
            dataSourceLinks.Add(glPayrollDataSourceLink);

            return dataSourceLinks;
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
            await jazzDbContext.Measures.AddAsync(GetGLMeasure());
            await jazzDbContext.SaveChangesAsync();
        }

        internal static Measure GetGLMeasure()
        {
            var measure = new Measure()
            {
                MeasureGuid = new Guid("d33709b1-e53b-4c54-b606-d647fdcad52e"),
                DataTableGuid = DataTableConstants.DSSGLGuid,
                FriendlyName = "Test GL Measure",
                SQLColumnName = MeasureConstants.YTDDollarsMeasure
            };

            return measure;
        }

        internal static Measure GetSummaryMeasure()
        {
            var measure = new Measure()
            {
                MeasureGuid = new Guid("6f322ca6-7b21-4498-9457-fb0654c3872e"),
                DataTableGuid = DataTableConstants.PatientEncounterSummaryGuid,
                FriendlyName = "Test Summary Measure",
                SQLColumnName = MeasureConstants.PES_EncounterRecordNumber_ColumnName
            };

            return measure;
        }

        internal static Measure GetDollarsMeasure()
        {
            var measure = new Measure()
            {
                MeasureGuid = new Guid("9178ea60-a4bb-4e5d-ae35-7cae55156947"),
                DataTableGuid = DataTableConstants.PayrollSampledGuid,
                FriendlyName = "Test Dollars Measure",
                SQLColumnName = MeasureConstants.YTDDollarsMeasure
            };

            return measure;
        }

        internal static Measure GetHoursMeasure()
        {
            var measure = new Measure()
            {
                MeasureGuid = new Guid("55476349-4b1c-4042-a214-9312826f49e2"),
                DataTableGuid = DataTableConstants.PayrollSampledGuid,
                FriendlyName = "Test Hours Measure",
                SQLColumnName = MeasureConstants.YTDHoursMeasure
            };

            return measure;
        }

        internal static Measure GetUnitsMeasure()
        {
            var measure = new Measure()
            {
                MeasureGuid = new Guid("70376aec-d3b2-45d9-adbd-002e3e6d3479"),
                DataTableGuid = DataTableConstants.StatisticDriverGuid,
                FriendlyName = "Test Units Measure",
                SQLColumnName = SDMeasureConstants.AmountCol_FriendlyName
            };

            return measure;
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
