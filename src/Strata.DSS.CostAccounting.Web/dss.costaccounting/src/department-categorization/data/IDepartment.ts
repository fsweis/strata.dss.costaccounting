import { ICostingDepartmentTypeException } from './ICostingDepartmentTypeException';

export interface IDepartment {
  departmentId: number;
  departmentCode: number;
  departmentType: string;
  departmentTypeId: number;
  name: string;
  deptExceptionType: number;
  isHealthPlanAdmin: number;
  isClaimsCosting: number;
  costingDepartmentTypeException: ICostingDepartmentTypeException;
}
