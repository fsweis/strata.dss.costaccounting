import { ICostingDepartmentTypeException } from './ICostingDepartmentTypeException';

export interface IDepartment {
  departmentId: number;
  departmentCode: string;
  departmentType: string;
  description: string;
  name: string;
  isHealthPlanAdmin: number;
  isClaimsCosting: number;
  costingDepartmentTypeException: ICostingDepartmentTypeException | null;
}
