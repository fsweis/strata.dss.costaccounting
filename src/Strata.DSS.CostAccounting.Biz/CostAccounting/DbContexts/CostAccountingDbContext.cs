using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts
{
    // This does not use the MultiTenant DbContext. For more information on how to use it please
    // see this link: https://confluence.sdt.local/pages/viewpage.action?pageId=37335971#SQL(withEntityFrameworkCore)-Multitenancy
    // and the following sample: https://git.sdt.local/projects/DOCKER/repos/strata.demos.microservices.reviews/browse
    public class CostAccountingDbContext : DbContext
    {
        public DbSet<CostAccountingEntity> CostAccountings { get; set; }

        public CostAccountingDbContext(DbContextOptions<CostAccountingDbContext> options) : base(options)
        {

        }
    }
}
