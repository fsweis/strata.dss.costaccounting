using Microsoft.Extensions.Configuration;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.Hangfire.Configuration;
using Strata.SqlTools.Configuration.SqlServer;
using Strata.ApiCommunication.Http.MessageHandlers;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Repositories;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Services;
using System.Threading.Tasks;
using System;
using System.Threading;
using Strata.CoreLib.Claims.Extensions;
using Strata.SMC.Client;
using Microsoft.Data.SqlClient;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories.Interfaces;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection
{
    public static class CostAccountingServiceCollectionExtensions
    {
        public static IServiceCollection AddCostAccountingServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<ICostAccountingRepository, CostAccountingRepository>();
            services.AddScoped<ICostingConfigRepository, CostingConfigRepository>();
            services.AddScoped<IStatisticDriversRepository, StatisticDriversRepository>();
            services.AddScoped<IStatisticDriversService, StatisticDriversService>();
            services.AddScoped<IDataSourceService, DataSourceService>();
            services.AddScoped<IDataSourceLinkService, DataSourceLinkService>();
            services.AddCachedSmcServiceClient();
            services.AddHttpContextAccessor();
            services.TryAddScoped<IClaimsPrincipalAccessor, ClaimsPrincipalAccessor>();
            services.AddAsyncDbContextFactory<CostAccountingDbContext>(options =>
            {
                options
                    //.WithConnectionString((provider, token) => provider.GetConnectionStringFromSmc(token))
                    .WithConnectionString((provider, token) => provider.GetConnectionStringUsingIntegratedSecurity(token))
                    .WithDbContextOptions((connectionString, builder) => builder.UseSqlServer(connectionString));
            });

            services.ConfigureHangfireOptionsFromAws(options =>
            {
                options.Schema = "costaccounting";
            });

            return services;
        }

        private static async Task<string> GetConnectionStringUsingIntegratedSecurity(
            this IServiceProvider provider,
            CancellationToken cancellationToken)
        {
            
            var claimsAccessor = provider.GetRequiredService<IClaimsPrincipalAccessor>();
            var databaseGuid = claimsAccessor.GetCurrentClaimsPrincipal()?.GetStrataDatabaseGuid();
         
            if (!databaseGuid.HasValue)
            {
                throw new InvalidOperationException(
                    $"User must be authenticated an have claim with key: '{Strata.CoreLib.Claims.StrataClaims.DatabaseGuid}'.");
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
