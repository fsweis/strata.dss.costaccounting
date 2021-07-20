using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Enums;
using System;

namespace Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models
{
    public class CostingDepartmentTypeException
    {
        public int CostingDepartmentExceptionTypeId { get; set; }
        public int DepartmentId { get; set; }
        public Guid CostingConfigGuid { get; set; }
        public ExceptionDepartmentType DepartmentTypeEnum { get; set; }
    }
}
