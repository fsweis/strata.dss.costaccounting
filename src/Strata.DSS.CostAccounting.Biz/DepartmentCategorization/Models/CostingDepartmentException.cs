using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Enums;
using System;

namespace Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models
{
    public class CostingDepartmentException
    {
        public int CostingDepartmentExceptionTypeId { get; set; }
        public int DepartmentId { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public string Name { get; set; }
        public ExceptionDepartmentType DepartmentTypeEnum { get ; set; }
        public string OriginalDepartmentType { get ; set; } //getter only return department type enum
        public ExceptionDepartmentType OriginalDepartmentTypeAsEnum { get => (ExceptionDepartmentType)Enum.Parse(typeof(ExceptionDepartmentType), this.OriginalDepartmentType);  }
    public Guid DisplayId { get; set; }
    }
}
