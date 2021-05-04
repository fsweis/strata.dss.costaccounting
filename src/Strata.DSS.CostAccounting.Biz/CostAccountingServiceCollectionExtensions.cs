using Microsoft.Extensions.Configuration;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Repositories;
using Strata.Hangfire.Configuration;
using Strata.SqlTools.Configuration.SqlServer;
using Strata.ApiCommunication.Http.MessageHandlers;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection
{
    public static class CostAccountingServiceCollectionExtensions
    {
        public static IServiceCollection AddCostAccountingServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<ICostAccountingRepository, CostAccountingRepository>();
            services.AddCachedSmcServiceClient();
            services.AddHttpContextAccessor();
            services.TryAddScoped<IClaimsPrincipalAccessor, ClaimsPrincipalAccessor>();
            services.AddAsyncDbContextFactory<CostAccountingDbContext>(options =>
            {
                options
                    .WithConnectionString((provider, token) => provider.GetConnectionStringFromSmc(token))
                    .WithDbContextOptions((connectionString, builder) => builder.UseSqlServer(connectionString));
            });   

            services.ConfigureHangfireOptionsFromAws(options =>
            {
                options.Schema = "costaccounting";
            });

            return services;
        }
    }
}
