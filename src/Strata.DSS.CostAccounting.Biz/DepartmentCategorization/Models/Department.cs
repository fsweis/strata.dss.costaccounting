using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string DepartmentCode { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public bool IsClaimsCosting { get; set; }
        public string DepartmentType { get; set; }//return the enumeration int
        public ExceptionDepartmentType DepartmentTypeAsEnum { get => (ExceptionDepartmentType)Enum.Parse(typeof(ExceptionDepartmentType), this.DepartmentType); }
    }
}
