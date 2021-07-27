using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Repositories
{
    public class DepartmentCategorizationRepository : IDepartmentCategorizationRepository
    {
        private readonly CostAccountingDbContext _dbContext;

        public DepartmentCategorizationRepository(CostAccountingDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddOrUpdateDepartmentException(List<CostingDepartmentTypeException> costingDepartmentTypeExceptions, CancellationToken cancellationToken)
        {
            var departmentExceptionsToAdd = costingDepartmentTypeExceptions.Where(x => x.CostingDepartmentExceptionTypeId == 0).ToList();
            var departmentExceptionsToUpdate = costingDepartmentTypeExceptions.Where(x => x.CostingDepartmentExceptionTypeId != 0).ToList();
                        
            if (departmentExceptionsToAdd.Any())
            {
                departmentExceptionsToAdd.ForEach((x) => _dbContext.Entry<CostingDepartmentTypeException>(x).State = EntityState.Added);
            }

            if (departmentExceptionsToUpdate.Any())
            {
                departmentExceptionsToUpdate.ForEach((x) => _dbContext.Entry<CostingDepartmentTypeException>(x).State = EntityState.Modified);
            }
            
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteDepartmentExceptions(Guid costConfigGuid, List<int> departmentIds, CancellationToken cancellationToken)
        {
            var departmentsExceptionsToDelete = await _dbContext.CostingDepartmentTypeExceptions.Where(x => departmentIds.Contains(x.DepartmentId) && x.CostingConfigGuid == costConfigGuid).ToListAsync();
            _dbContext.CostingDepartmentTypeExceptions.RemoveRange(departmentsExceptionsToDelete);

            await _dbContext.SaveChangesAsync(cancellationToken);
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
