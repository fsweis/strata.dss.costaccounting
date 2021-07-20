using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Services
{
    public interface IDepartmentCategorizationService
    {
        public IEnumerable<Department> GetDepartmentByType(Guid costingConfigGuid, string departmentType, CancellationToken cancellationToken);
    }
}
