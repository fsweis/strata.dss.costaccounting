using Microsoft.EntityFrameworkCore;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Entities;
using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;

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

        public virtual DbSet<DriverConfig> DriverConfigs { get; set; }
        public virtual DbSet<Measure> Measures { get; set; }
        public virtual DbSet<DataTable> DataTables { get; set; }
        public virtual DbSet<RuleSet> RuleSets { get; set; }
        public virtual DbSet<CostingConfig> CostingConfigs { get; set; }
        public virtual DbSet<RuleEngineIncludedMeasure> RuleEngineIncludedMeasures { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DriverConfig>(entity =>
            {
                entity.HasKey(e => e.DriverConfigGuid);
                entity.ToTable("DriverConfig", "dss");
                entity.Property(e => e.Name).HasColumnName("Name");
                entity.Property(e => e.DriverConfigGuid).HasColumnName("DriverConfigGuid");
                entity.Property(e => e.MeasureGUID).HasColumnName("MeasureGUID");
                entity.Property(e => e.CostingType).HasColumnName("CostingType");
                entity.Property(e => e.CostingConfigGuid).HasColumnName("CostingConfigGuid");
                entity.Property(e => e.IsInverted).HasColumnName("IsInverted");
            });

            modelBuilder.Entity<Measure>(entity =>
            {
                entity.HasKey(e => e.MeasureGUID);
                entity.ToTable("ScoreMeasure", "dbo");
                entity.Property(e => e.MeasureGUID).HasColumnName("MeasureGUID");
                entity.Property(e => e.FriendlyName).HasColumnName("FriendlyName");
                entity.Property(e => e.DataTableGUID).HasColumnName("DataTableGUID");
                entity.Property(e => e.SQLColumnName).HasColumnName("SQLColumnName");
            });

            modelBuilder.Entity<DataTable>(entity =>
            {
                entity.HasKey(e => e.DataTableGUID);
                entity.ToTable("ScoreDataTable", "dbo");
                entity.Property(e => e.DataTableGUID).HasColumnName("DataTableGUID");
                entity.Property(e => e.FriendlyName).HasColumnName("FriendlyName");
                entity.Property(e => e.GlobalID).HasColumnName("GlobalID");
            });

            modelBuilder.Entity<RuleSet>(entity =>
            {
                entity.HasKey(e => e.RuleSetGUID);
                entity.ToTable("RuleSet", "dbo");
                entity.Property(e => e.Category).HasColumnName("Category");
                entity.Property(e => e.ExecutionOrder).HasColumnName("ExecutionOrder");
                entity.Property(e => e.RootRuleGroupGUID).HasColumnName("RootRuleGroupGUID");
                entity.Property(e => e.RuleSetGUID).HasColumnName("RuleSetGUID");
                entity.Property(e => e.RuleSetID).HasColumnName("RuleSetID");
            });

            modelBuilder.Entity<CostingConfig>(entity =>
            {
                entity.HasKey(e => e.CostingConfigGuid);
                entity.ToTable("CostingConfig", "dss");
                entity.Property(e => e.CostingConfigGuid).HasColumnName("CostingConfigGuid");
                entity.Property(e => e.Name).HasColumnName("Name");
                entity.Property(e => e.FiscalYearID).HasColumnName("FiscalYearID");
                entity.Property(e => e.IsGLCosting).HasColumnName("IsGLCosting");
                entity.Property(e => e.IsPayrollCosting).HasColumnName("IsPayrollCosting");
                entity.Property(e => e.Type).HasColumnName("Type");
                entity.Property(e => e.IsEditable).HasColumnName("IsEditable");
            });

            modelBuilder.Entity<RuleEngineIncludedMeasure>(entity =>
            {
                entity.HasKey(e => e.RuleEngineIncludedMeasureGUID);
                entity.ToTable("viewRuleEngineIncludedMeasure", "dss");
                entity.Property(e => e.DataTableGUID).HasColumnName("DataTableGUID");
                entity.Property(e => e.MeasureGUID).HasColumnName("MeasureGUID");
                entity.Property(e => e.DataTableName).HasColumnName("DataTableName");
                entity.Property(e => e.MeasureName).HasColumnName("MeasureName");
                entity.Property(e => e.IsIncludedInRules).HasColumnName("IsIncludedInRules");
                entity.Property(e => e.IsIncludedInSchedules).HasColumnName("IsIncludedInSchedules");
                entity.Property(e => e.IsIncludedInAdHocPatientPopulations).HasColumnName("IsIncludedInAdHocPatientPopulations");
                entity.Property(e => e.IsIncludedInActions).HasColumnName("IsIncludedInActions");
            });
        }
    }
}

