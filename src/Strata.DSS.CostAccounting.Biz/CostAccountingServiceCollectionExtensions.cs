using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Strata.ApiCommunication.Http.MessageHandlers;
using Strata.CoreLib.Claims.Extensions;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Repositories;using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services;
using Strata.Hangfire.Configuration;
using Strata.SMC.Client;
using Strata.SqlTools.Configuration.SqlServer;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace Microsoft.Extensions.DependencyInjection
{
    public static class CostAccountingServiceCollectionExtensions
    {
        public static IServiceCollection AddCostAccountingServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<ICostAccountingRepository, CostAccountingRepository>();
            services.AddScoped<ICostingConfigRepository, CostingConfigRepository>();
            services.AddScoped<IStatisticDriversRepository, StatisticDriversRepository>();
            services.AddScoped<ISystemSettingRepository, SystemSettingRepository>();

            services.AddScoped<IStatisticDriversService, StatisticDriversService>();
            services.AddScoped<IDataSourceService, DataSourceService>();
            services.AddScoped<IDataSourceLinkService, DataSourceLinkService>();

            services.AddCachedSmcServiceClient();
            services.AddHttpContextAccessor();
            services.TryAddScoped<IClaimsPrincipalAccessor, ClaimsPrincipalAccessor>();
            services.AddAsyncDbContextFactory<CostAccountingDbContext>(options =>
            {
                options
                .UseSqlServer()
#if DEBUG
                    .WithConnectionString(GetConnectionStringUsingIntegratedSecurity);
#else
                   .WithConnectionString((provider, cancellationToken) => provider.GetConnectionStringFromSmc(cancellationToken));
#endif
            });

            services.ConfigureHangfireOptionsFromAws(options =>
            {
                options.Schema = "costaccounting";
            });

            return services;
        }

        private static async Task<string> GetConnectionStringUsingIntegratedSecurity(IServiceProvider provider, CancellationToken cancellationToken)
        {
            var claimsAccessor = provider.GetRequiredService<IClaimsPrincipalAccessor>();
            var databaseGuid = claimsAccessor.GetCurrentClaimsPrincipal()?.GetStrataDatabaseGuid();
            if (!databaseGuid.HasValue)
            {
                throw new InvalidOperationException($"User must be authenticated an have claim with key: '{Strata.CoreLib.Claims.StrataClaims.DatabaseGuid}'.");
            }

            var smc = provider.GetRequiredService<ISMCServiceClient>();
            var database = await smc.GetDatabaseAsync(databaseGuid.Value, cancellationToken);
            var connectionStringBuilder = new SqlConnectionStringBuilder
            {
                DataSource = database.ServerName,
                InitialCatalog = database.PhysicalName,
                IntegratedSecurity = true,
                Encrypt = true,
                TrustServerCertificate = true,
                MultiSubnetFailover = false
            };

            return connectionStringBuilder.ToString();
        }
    }
}
