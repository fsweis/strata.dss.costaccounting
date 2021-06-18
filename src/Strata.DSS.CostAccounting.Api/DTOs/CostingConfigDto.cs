using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.CostingConfigs.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.DTOs
{
    public class CostingConfigDto
    {
        private CostConfigSaveResult saveResult;

        public CostingConfigDto(CostingConfigModel costingConfig)
        {
            CostingConfigGuid = costingConfig.CostingConfigGuid;
            Name = costingConfig.Name;
            Description = costingConfig.Description;
            IsGLCosting = costingConfig.IsGLCosting;
            IsPayrollCosting = costingConfig.IsPayrollCosting;
            DefaultChargeAllocationMethod = costingConfig.DefaultChargeAllocationMethod;
            FiscalYearId = costingConfig.FiscalYearId;
            FiscalMonthId = costingConfig.FiscalMonthId;
            CreatedAt = costingConfig.CreatedAt;
            ModifiedAtUtc = costingConfig.ModifiedAtUtc;
            LastPublishedUtc = costingConfig.LastPublishedUtc;
            IsEditable = costingConfig.IsEditable;
        }

        public Guid CostingConfigGuid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsGLCosting { get; set; }
        public bool IsPayrollCosting { get; set; }
        public bool IsBudgetedAndActualCosting { get; set; }
        public bool IsUtilizationEntityConfigured { get; set; }
        public short DefaultChargeAllocationMethod { get; set; }
        public short FiscalYearId { get; set; }
        public short FiscalMonthId { get; set; }
        public int Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAtUtc { get; set; }
        public DateTime? LastPublishedUtc { get; set; }
        public bool IsEditable { get; set; }
        public List<int> GlPayrollEntities { get; set; }
        public List<int> UtilEntities { get; set; }
    }
}
