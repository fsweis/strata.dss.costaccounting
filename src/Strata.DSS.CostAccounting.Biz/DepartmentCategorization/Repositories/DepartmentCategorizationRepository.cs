using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Repositories
{
    public class DepartmentCategorizationRepository : IDepartmentCategorizationRepository
    {
        private readonly CostAccountingDbContext _dbContext;

        public DepartmentCategorizationRepository(CostAccountingDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public Task AddOrUpdateDepartmentException(List<CostingDepartmentTypeException> costingDepartmentTypeExceptions, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task DeleteDepartmentException(List<Guid> costingDepartmentTypeExceptionGuids, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<CostingDepartmentException> GetDepartmentExceptions(Guid costingConfigGuid, CancellationToken cancellationToken)
        {
            var exceptions = _dbContext.DepartmentExceptions.Where(x => x.CostingConfigGuid == costingConfigGuid);
            return exceptions;
        }

        public IEnumerable<Department> GetDepartments(CancellationToken cancellationToken)
        {
            var departments =  _dbContext.Departments;
            return departments;
        }

        public IEnumerable<Department> GetDepartmentsBySearch(string searchString, CancellationToken cancellationToken)
        {
            var departments = _dbContext.Departments.Where(x => x.Name.ToLower().Contains(searchString.ToLower()) || x.DepartmentCode.ToLower().Contains(searchString.ToLower()));
            return departments;
        }
    }
}
