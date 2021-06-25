import { ICostDepartmentType } from './ICostDepartmentType';

export interface ICostingDepartmentTypeException {
  costingDepartmentExceptionTypeId: number;
  departmentId: number;
  costingConfigGuid: string;
  departmentTypeEnum: number;
  CostingDepartmentType: ICostDepartmentType;
}
