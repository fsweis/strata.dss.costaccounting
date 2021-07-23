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

            try
            {
                if (departmentExceptionsToAdd.Any())
                {
                    departmentExceptionsToAdd.ForEach((x) => _dbContext.Entry<CostingDepartmentTypeException>(x).State = EntityState.Added);
                }

                if (departmentExceptionsToUpdate.Any())
                {
                    departmentExceptionsToUpdate.ForEach((x) => _dbContext.Entry<CostingDepartmentTypeException>(x).State = EntityState.Modified);
                }
            }
            catch (Exception e)
            {

                throw;
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteDepartmentExceptions(List<int> costingDepartmentTypeExceptionIds, CancellationToken cancellationToken)
        {
            var departmentsExceptionsToDelete = _dbContext.CostingDepartmentTypeExceptions.Where(x => costingDepartmentTypeExceptionIds.Contains(x.CostingDepartmentExceptionTypeId));
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
