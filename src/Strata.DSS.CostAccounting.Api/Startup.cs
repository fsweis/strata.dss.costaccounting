using System.Diagnostics.CodeAnalysis;
using System.Net.Mime;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Prometheus;
using Strata.ApiLib.Core.Cors.Extensions;
using Strata.ApiLib.Core.ExceptionHandling.DependencyInjection.Bootstrappers;
using Strata.ApiLib.Core.Logging.Bootstrappers;
using Strata.ApiLib.Core.StrataAuthentication.Bootstrappers;
using Strata.Hangfire.AspNetCore;
using Strata.Hangfire.AspNetCore.Filters.Dashboard;
using Strata.SwaggerExtensions;

namespace Strata.DSS.CostAccounting.Api
{
    [ExcludeFromCodeCoverage]
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddGlobalExceptionMiddleware(_configuration);
            services.AddControllers(options =>
            {
                //Prevent browsers from caching API responses (this addresses an IE11 issue):
                options.Filters.Add(
                    new ResponseCacheAttribute()
                    {
                        Location = ResponseCacheLocation.None,
                        NoStore = false,
                        Duration = -1
                    });
                options.ReturnHttpNotAcceptable = true;
                options.Filters.Add(new ProducesAttribute(MediaTypeNames.Application.Json));
                options.Filters.Add(new ConsumesAttribute(MediaTypeNames.Application.Json));

            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            // configure hangfire
           // services.AddStrataHangfire();
            services.AddCostAccountingServices(_configuration);

            services.AddRouting();
            services.AddSwagger(_configuration);
            services.AddStrataAuthentication(_configuration);
            services.AddStrataCors(_configuration);
            services.AddHealthChecks();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            app.UseGlobalExceptionMiddleware();
            app.UseRouting();

            app.UseStrataCorsPolicy(env);

            if (!env.IsDevelopment()) 
            {
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            app.UseMetricServer();
            app.UseHttpMetrics();

            app.UseStrataAuthentication();
            app.UseClaimsLogging();
            app.ConfigureSwagger(env, provider);

#if DEBUG
          /*  app.UseHangfireDashboard("/hangfire", new DashboardOptions
                {
                    Authorization = new[] {new AllowAnyoneDashboardAuthorizationFilter()}
                });
          */
#endif
            app.UseHealthChecks("/health");
            app.UseEndpoints(endpoints => endpoints.MapControllers().RequireAuthorization());
        }
    }
}
