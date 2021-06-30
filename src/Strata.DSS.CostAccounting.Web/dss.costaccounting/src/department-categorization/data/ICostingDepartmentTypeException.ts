import { ICostDepartmentType } from './ICostDepartmentType';

export interface ICostingDepartmentTypeException {
  costingDepartmentExceptionTypeId: number;
  departmentId: number;
  costingConfigGuid: string;
  departmentTypeEnum: number;
  costingDepartmentType: string;
  deptExceptionType: number;
  deptExceptionTypeName: string;
}
