using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Strata.Configuration.Client.DependencyInjection;
using Strata.Logging.DependencyInjection;

namespace Strata.DSS.CostAccounting.Hangfire.Dashboard
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
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
