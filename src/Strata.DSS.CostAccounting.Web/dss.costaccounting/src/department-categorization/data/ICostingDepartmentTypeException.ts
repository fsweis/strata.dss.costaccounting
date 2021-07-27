import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';

export interface ICostingDepartmentTypeException {
  costingDepartmentExceptionTypeId: number;
  departmentId: number;
  costingConfigGuid: string;
  departmentTypeEnum: DepartmentTypeEnum;
}
