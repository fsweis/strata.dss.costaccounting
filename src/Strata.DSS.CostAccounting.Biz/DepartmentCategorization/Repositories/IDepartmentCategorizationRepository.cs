using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Repositories
{
    public interface IDepartmentCategorizationRepository
    {
        public IEnumerable<CostingDepartmentException> GetDepartmentExceptions (Guid costingConfigGuid, CancellationToken cancellationToken);
        public IEnumerable<Department> GetDepartments(CancellationToken cancellationToken);
        public IEnumerable<Department> GetDepartmentsBySearch(string searchString, CancellationToken cancellationToken);
        public Task AddOrUpdateDepartmentException(List<CostingDepartmentTypeException> costingDepartmentTypeExceptions, CancellationToken cancellationToken);
        public Task DeleteDepartmentExceptions(List<int> costingDepartmentTypeExceptionIds, CancellationToken cancellationToken);

    }
}
