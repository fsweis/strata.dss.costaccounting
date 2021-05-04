using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Strata.Hangfire.AspNetCore;
using Strata.Hangfire.AspNetCore.Filters.Dashboard;

namespace Strata.DSS.CostAccounting.Hangfire.Dashboard
{
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
            // configure hangfire
            services.AddStrataHangfire();

            services.AddCostAccountingServices(_configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHangfireDashboard("", new DashboardOptions
            {
                Authorization = new[] {new AllowAnyoneDashboardAuthorizationFilter()}
            });

            app.UseRouting();
        }
    }
}
