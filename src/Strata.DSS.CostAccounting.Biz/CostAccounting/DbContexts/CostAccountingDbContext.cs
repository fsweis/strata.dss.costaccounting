using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;

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

        public virtual DbSet<Measure> Measures { get; set; }
        public virtual DbSet<DataTable> DataTables { get; set; }
        public virtual DbSet<RuleSet> RuleSets { get; set; }
        public virtual DbSet<CostingConfig> CostingConfigs { get; set; }
        public virtual DbSet<RuleEngineIncludedMeasure> RuleEngineIncludedMeasures { get; set; }

        public virtual DbSet<DriverConfig> DriverConfigs { get; set; }

          

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Measure>(entity =>
            {
                entity.HasKey(e => e.MeasureGUID);
                entity.ToTable("ScoreMeasure", "dbo");
            });

            modelBuilder.Entity<DataTable>(entity =>
            {
                entity.HasKey(e => e.DataTableGUID);
                entity.ToTable("ScoreDataTable", "dbo");
            });

            modelBuilder.Entity<RuleSet>(entity =>
            {
                entity.HasKey(e => e.RuleSetGUID);
                entity.ToTable("RuleSet", "dbo");
            });

            modelBuilder.Entity<CostingConfig>(entity =>
            {
                entity.HasKey(e => e.CostingConfigGUID);
                entity.ToTable("CostingConfig", "dss");
            });

            modelBuilder.Entity<RuleEngineIncludedMeasure>(entity =>
            {
                entity.HasKey(e => e.RuleEngineIncludedMeasureGUID);
                entity.ToTable("viewRuleEngineIncludedMeasure", "dss");
            });

            modelBuilder.Entity<DriverConfig>(entity =>
            {
                entity.HasKey(e => e.DriverConfigGUID);
                entity.ToTable("DriverConfig", "dss");
            });
        }
    }
}

