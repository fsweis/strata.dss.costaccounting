using Strata.DSS.CostAccounting.Biz.CostAccounting.Models;
using Strata.DSS.CostAccounting.Biz.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Api.DTOs
{
    public class CostingConfigDto
    {
        public CostingConfigDto(CostingConfigModel costingConfig)
        {
            CostingConfigGuid = costingConfig.CostingConfigGuid;
            Name = costingConfig.Name;
            Description = costingConfig.Description;
            IsGLCosting = costingConfig.IsGLCosting;
            DefaultChargeAllocationMethod = costingConfig.DefaultChargeAllocationMethod;
            FiscalYearID = costingConfig.FiscalYearID;
            Type = (int)costingConfig.Type;
            CreatedAt = costingConfig.CreatedAt;
            ModifiedAtUtc = costingConfig.ModifiedAtUtc;
            LastPublishedUtc = costingConfig.LastPublishedUtc;
            IsEditable = costingConfig.IsEditable;
        }

        public Guid CostingConfigGuid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsGLCosting { get; set; }
        public short DefaultChargeAllocationMethod { get; set; }
        public short FiscalYearID { get; set; }
        public int Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAtUtc { get; set; }
        public DateTime? LastPublishedUtc { get; set; }
        public bool IsEditable { get; set; }
    }
}
