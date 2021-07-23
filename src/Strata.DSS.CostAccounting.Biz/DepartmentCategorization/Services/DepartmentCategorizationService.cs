using Strata.DSS.CostAccounting.Biz.CostAccounting.DbContexts;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Enums;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Models;
using Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace Strata.DSS.CostAccounting.Biz.DepartmentCategorization.Services
{
    public class DepartmentCategorizationService : IDepartmentCategorizationService
    {
        
        private readonly CostAccountingDbContext _dbContext;

        public DepartmentCategorizationService(CostAccountingDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public IEnumerable<Department> GetDepartmentByType(Guid costingConfigGuid, string departmentType, CancellationToken cancellationToken)
        {
            var deptsWithExceptions = _dbContext.Departments.Join(_dbContext.DepartmentExceptions,
                                                    dept => dept.DepartmentId,
                                                    except => except.DepartmentId,
                                                    (dept, except) => new { Dept = dept, Except = except })
                                                    .Where(deptAndExcept => deptAndExcept.Except.CostingConfigGuid == costingConfigGuid);

            //remove the departments that have exceptions
            var departmentsToRemove = deptsWithExceptions.Where(x => x.Except.DepartmentTypeEnum != (ExceptionDepartmentType)int.Parse(departmentType)).Select(x => x.Dept);
            var departmentsToAdd = deptsWithExceptions.Where(x => x.Except.DepartmentTypeEnum == (ExceptionDepartmentType)int.Parse(departmentType)).Select(x => x.Dept);
            var departmentsScrubbed = _dbContext.Departments.Where(x => x.DepartmentType == ((ExceptionDepartmentType)int.Parse(departmentType)).ToString()).Except(departmentsToRemove).Union(departmentsToAdd);

            return departmentsScrubbed;
        }
    }
}
