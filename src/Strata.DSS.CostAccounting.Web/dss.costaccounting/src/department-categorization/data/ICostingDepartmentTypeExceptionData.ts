import { getNewGuid } from '../../shared/Utils';
import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';
import { ExceptionTypeEnum } from '../enums/ExceptionTypeEnum';

export interface ICostingDepartmentTypeExceptionData {
  displayId: string;
  costingDepartmentExceptionTypeId: number;
  departmentId: number;
  costingConfigGuid: string;
  departmentTypeEnum: DepartmentTypeEnum;
  departmentName: string;
  exceptionType?: ExceptionTypeEnum;
  originalDepartmentTypeAsEnum: DepartmentTypeEnum;
}
export const newDepartmentException = (exception: Partial<ICostingDepartmentTypeExceptionData> = {}): ICostingDepartmentTypeExceptionData => {
  return {
    ...{
      displayId: getNewGuid(),
      costingDepartmentExceptionTypeId: 0,
      departmentId: 0,
      costingConfigGuid: '',
      departmentTypeEnum: DepartmentTypeEnum.Revenue,
      departmentName: '',
      exceptionType: undefined,
      originalDepartmentTypeAsEnum: DepartmentTypeEnum.Revenue
    },
    ...exception
  };
};
