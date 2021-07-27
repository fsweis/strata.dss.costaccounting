using Strata.DSS.CostAccounting.Biz.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models
{
    public class CostingDepartmentTypeExceptionSaveData : SaveDataBase<CostingDepartmentTypeException>
    {
        public List<int> DeletedIds { get; set; }
        public Guid CostingConfigGuid { get; set; }
    }
}
