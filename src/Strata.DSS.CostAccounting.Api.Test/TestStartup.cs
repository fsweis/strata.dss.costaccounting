using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Configuration;

namespace Strata.DSS.CostAccounting.Api.Test
{
    public class TestStartup : Startup
    {
        private IConfiguration _config;
        public TestStartup(IConfiguration configuration) : base(configuration, configuration["connectionString"])
        {
            _config = configuration;
        }

        public override void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            var isStrataUser = _config.GetValue<bool>("isStrataUser");
            var principal = TestData.GetClaimsPrincipal(isStrataUser);
            //app.AddTestPrincipal(principal.Claims);
            base.Configure(app, env, provider);
        }
    }
}
