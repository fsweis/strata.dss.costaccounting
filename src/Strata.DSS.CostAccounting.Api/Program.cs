using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Serilog;
using Strata.Configuration.Client.DependencyInjection;
using Strata.Logging.DependencyInjection;
using System;
using System.Diagnostics.CodeAnalysis;

namespace Strata.DSS.CostAccounting.Api
{
    [ExcludeFromCodeCoverage]
    public class Program
    {
        protected Program()
        {
        }

        public static void Main(string[] args)
        {
            try
            {
                CreateWebHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "There was an unhandled exception that caused the program to crash");

                //This is for serilog to ensure that all of the cached logs are flushed when the app crashes
                //This is useful so we can capture logs when the application crashes during startup:
                Log.CloseAndFlush();
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStrataConfiguration()
                .UseStrataLogging()
                .UseStartup<Startup>();
    }
}
