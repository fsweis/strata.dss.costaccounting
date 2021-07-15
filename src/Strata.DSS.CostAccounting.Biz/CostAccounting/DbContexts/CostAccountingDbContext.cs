using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.DSS.CostAccounting.Biz.StatisticDrivers.Models;

namespace Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts
{
    // This does not use the MultiTenant DbContext. For more information on how to use it please
    // see this link: https://confluence.sdt.local/pages/viewpage.action?pageId=37335971#SQL(withEntityFrameworkCore)-Multitenancy
    // and the following sample: https://git.sdt.local/projects/DOCKER/repos/strata.demos.microservices.reviews/browse
    public class CostAccountingDbContext : DbContext
    {
        public CostAccountingDbContext(DbContextOptions<CostAccountingDbContext> options) : base(options)
        {
        }

        public virtual DbSet<Measure> Measures { get; set; }
        public virtual DbSet<DataTable> DataTables { get; set; }
        public virtual DbSet<RuleSet> RuleSets { get; set; }
        public virtual DbSet<FiscalMonth> FiscalMonths { get; set; }
        public virtual DbSet<FiscalYear> FiscalYears { get; set; }
        public virtual DbSet<Entity> Entities { get; set; }
        public virtual DbSet<CostingConfig> CostingConfigs { get; set; }
        public virtual DbSet<CostingResult> CostingResults { get; set; }
        public virtual DbSet<RuleEngineIncludedMeasure> RuleEngineIncludedMeasures { get; set; }
        public virtual DbSet<DriverConfig> DriverConfigs { get; set; }
        public virtual DbSet<DriverConfigView> DriverConfigViews { get; set; }

        public virtual DbSet<AccountReclass> AccountReclasses { get; set; }
        public virtual DbSet<PayCodeJobCodeReclass> PayCodeJobCodeReclasses { get; set; }
        public virtual DbSet<DepartmentReclass> DepartmentReclasses { get; set; }
        public virtual DbSet<AllocationConfig> AllocationConfigs { get; set; }
        public virtual DbSet<AllocationConfigOverride> AllocationConfigOverrides { get; set; }

        public virtual DbSet<SystemSetting> SystemSettings { get; set; }

        public virtual DbSet<CostingConfigEntityLevelSecurity> CostingConfigEntityLevelSecurities { get; set; }

        public virtual DbSet<CostingConfigEntityLinkage> CostingConfigEntityLinkages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Measure>(entity =>
            {
                entity.HasKey(e => e.MeasureGuid);
                entity.ToTable("ScoreMeasure", "dbo");
            });

            modelBuilder.Entity<DataTable>(entity =>
            {
                entity.HasKey(e => e.DataTableGuid);
                entity.ToTable("ScoreDataTable", "dbo");
            });

            modelBuilder.Entity<RuleSet>(entity =>
            {
                entity.HasKey(e => e.RuleSetGuid);
                entity.ToTable("RuleSet", "dbo");
            });

            modelBuilder.Entity<SystemSetting>(entity =>
            {
                entity.HasKey(e => e.SystemSettingId);
                entity.ToTable("SystemSetting", "dss");
            });

            modelBuilder.Entity<Entity>(entity =>
            {
                entity.HasKey(e => e.EntityId);
                entity.ToTable("DimEntity", "fw");
            });

            modelBuilder.Entity<FiscalMonth>(entity =>
            {
                entity.HasKey(e => e.FiscalMonthId);
                entity.ToTable("DimFiscalMonth", "fw");
            });

            modelBuilder.Entity<FiscalYear>(entity =>
            {
                entity.HasKey(e => e.FiscalYearId);
                entity.ToTable("DimFiscalYear", "fw");
            });

            modelBuilder.Entity<CostingConfig>(entity =>
            {
                entity.HasKey(e => e.CostingConfigGuid);
                entity.ToTable("CostingConfig", "dss");
                entity.HasMany(e => e.CostingResults).WithOne().HasForeignKey(el => el.CostingConfigGuid);
                entity.HasMany(e => e.EntityLinkages).WithOne().HasForeignKey(el => el.CostingConfigGuid);
                entity.Ignore(e => e.LastPublishedUtc);
            });

            modelBuilder.Entity<CostingResult>(entity =>
            {
                entity.HasKey(e => e.CostingResultId);
                entity.ToTable("CostingResult", "dss");
                entity.HasQueryFilter(e => !EF.Property<bool>(e, "IsMarkedForDeletion"));
            });

            modelBuilder.Entity<RuleEngineIncludedMeasure>(entity =>
            {
                entity.HasKey(e => e.RuleEngineIncludedMeasureGuid);
                entity.ToTable("viewRuleEngineIncludedMeasure", "dss");
            });

            modelBuilder.Entity<DriverConfig>(entity =>
            {
                entity.HasKey(e => e.DriverConfigGuid);
                entity.ToTable("DriverConfig", "dss");
            });

            modelBuilder.Entity<DriverConfigView>(entity =>
            {
                entity.HasKey(e => e.DriverConfigGuid);
                entity.ToTable("viewDriverConfigInfo", "dss");
            });

            modelBuilder.Entity<AccountReclass>(entity =>
            {
                entity.HasKey(e => e.AccountReclassGuid);
                entity.ToTable("AccountReclass", "dss");
            });

            modelBuilder.Entity<PayCodeJobCodeReclass>(entity =>
            {
                entity.HasKey(e => e.PayCodeJobCodeReclassGuid);
                entity.ToTable("PayCodeJobCodeReclass", "dss");
            });

            modelBuilder.Entity<DepartmentReclass>(entity =>
            {
                entity.HasKey(e => e.DepartmentReclassGuid);
                entity.ToTable("DepartmentReclass", "dss");
            });

            modelBuilder.Entity<AllocationConfig>(entity =>
            {
                entity.HasKey(e => e.AllocationConfigGuid);
                entity.ToTable("AllocationConfig", "dss");
            });

            modelBuilder.Entity<AllocationConfigOverride>(entity =>
            {
                entity.HasKey(e => e.AllocationConfigOverrideGuid);
                entity.ToTable("AllocationConfigOverride", "dss");
            });

            modelBuilder.Entity<RuleSet>(entity =>
            {
                entity.HasKey(e => e.RuleSetId);
                entity.ToTable("RuleSet", "dbo");
            });

            modelBuilder.Entity<CostingConfigEntityLevelSecurity>(entity =>
            {
                entity.HasKey(e => e.CostingConfigEntityLevelSecurityId);
                entity.ToTable("CostingConfigEntityLevelSecurity", "dss");
            });

            modelBuilder.Entity<CostingConfigEntityLinkage>(entity =>
            {
                entity.HasKey(e => e.CostingConfigEntityLinkageId);
                entity.ToTable("CostingConfigEntityLinkage", "dss");
            });
        }
    }
}