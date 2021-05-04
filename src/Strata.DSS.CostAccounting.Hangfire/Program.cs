using System;
using Hangfire;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Strata.Configuration.Client.DependencyInjection;
using Strata.Hangfire.NetCore;
using Strata.Logging.DependencyInjection;

namespace Strata.DSS.CostAccounting.Hangfire
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseStrataConfiguration()
                .UseStrataLogging()
                .ConfigureServices((hostContext, services) =>
                {
                    services.Configure<HostOptions>(option => { option.ShutdownTimeout = TimeSpan.FromSeconds(60); });

                    #region Hangfire

                    // setup storage - tells hangfire where to send the job
                    services.AddStrataHangfire();

                    // setup server - allows application to process background jobs
                    services.AddHangfireServer(options =>
                    {

                    });

                    services.AddCostAccountingServices(hostContext.Configuration);

                    #endregion

                });
    }
}
