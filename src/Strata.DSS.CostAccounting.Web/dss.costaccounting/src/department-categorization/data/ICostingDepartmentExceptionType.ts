import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';
import { getExceptionName, ExceptionTypeEnum } from '../enums/ExceptionTypeEnum';

export interface ICostingDepartmentExceptionType {
  text: string;
  value: number;
}

export const getExceptionTypeOptions = (departmentType?: DepartmentTypeEnum): ICostingDepartmentExceptionType[] => {
  let items: ICostingDepartmentExceptionType[];
  switch (departmentType) {
    case DepartmentTypeEnum.Revenue:
      items = [
        { text: getExceptionName(ExceptionTypeEnum.RevenueToExcluded), value: ExceptionTypeEnum.RevenueToExcluded },
        { text: getExceptionName(ExceptionTypeEnum.RevenueToOverhead), value: ExceptionTypeEnum.RevenueToOverhead }
      ];
      break;
    case DepartmentTypeEnum.Overhead:
      items = [
        { text: getExceptionName(ExceptionTypeEnum.OverheadToRevenue), value: ExceptionTypeEnum.OverheadToRevenue },
        { text: getExceptionName(ExceptionTypeEnum.OverheadToExcluded), value: ExceptionTypeEnum.OverheadToExcluded }
      ];
      break;
    case DepartmentTypeEnum.Excluded:
      items = [
        { text: getExceptionName(ExceptionTypeEnum.ExcludedToOverhead), value: ExceptionTypeEnum.ExcludedToOverhead },
        { text: getExceptionName(ExceptionTypeEnum.ExcludedToRevenue), value: ExceptionTypeEnum.ExcludedToRevenue }
      ];
      break;
    default:
      items = [
        { text: getExceptionName(ExceptionTypeEnum.RevenueToExcluded), value: ExceptionTypeEnum.RevenueToExcluded },
        { text: getExceptionName(ExceptionTypeEnum.RevenueToOverhead), value: ExceptionTypeEnum.RevenueToOverhead },
        { text: getExceptionName(ExceptionTypeEnum.OverheadToRevenue), value: ExceptionTypeEnum.OverheadToRevenue },
        { text: getExceptionName(ExceptionTypeEnum.OverheadToExcluded), value: ExceptionTypeEnum.OverheadToExcluded },
        { text: getExceptionName(ExceptionTypeEnum.ExcludedToOverhead), value: ExceptionTypeEnum.ExcludedToOverhead },
        { text: getExceptionName(ExceptionTypeEnum.ExcludedToRevenue), value: ExceptionTypeEnum.ExcludedToRevenue }
      ];
      break;
  }
  return items;
};
