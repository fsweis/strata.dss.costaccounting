import { getNewGuid } from '../../shared/Utils';
import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';
import { ExceptionTypeEnum } from '../enums/ExceptionTypeEnum';

export interface ICostingDepartmentTypeException {
  displayId: string;
  costingDepartmentExceptionTypeId: number;
  departmentId: number;
  costingConfigGuid: string;
  departmentTypeEnum: DepartmentTypeEnum;
  name: string;
  deptExceptionType: ExceptionTypeEnum;
  originalDepartmentType: DepartmentTypeEnum;
}
export const newDepartmentException = (exception: Partial<ICostingDepartmentTypeException> = {}): ICostingDepartmentTypeException => {
  return {
    ...{
      displayId: getNewGuid(),
      costingDepartmentExceptionTypeId: 0,
      departmentId: 0,
      costingConfigGuid: '',
      departmentTypeEnum: DepartmentTypeEnum.Revenue,
      name: '',
      deptExceptionType: ExceptionTypeEnum.RevenueToOverhead,
      originalDepartmentType: DepartmentTypeEnum.Revenue
    },
    ...exception
  };
};
