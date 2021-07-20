import { getNewGuid } from '../../shared/Utils';
import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';
import { ExceptionTypeEnum } from '../enums/ExceptionTypeEnum';

export interface ICostingDepartmentTypeException {
  displayId: string;
  costingDepartmentExceptionTypeId: number;
  departmentId: number;
  costingConfigGuid: string;
  departmentTypeEnum: DepartmentTypeEnum;
  departmentName: string;
  exceptionType?: ExceptionTypeEnum;
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
      departmentName: '',
      exceptionType: undefined,
      originalDepartmentType: DepartmentTypeEnum.Revenue
    },
    ...exception
  };
};
