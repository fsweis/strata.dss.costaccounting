import { ExceptionTypeEnum } from './ExceptionTypeEnum';

export enum DepartmentTypeEnum {
  Revenue = 0,
  Overhead = 1,
  Excluded = 2,
  // For UI Only
  All
}

export const getExceptionType = (departmentType: DepartmentTypeEnum): ExceptionTypeEnum[] => {
  let items: ExceptionTypeEnum[];
  switch (departmentType) {
    case DepartmentTypeEnum.Revenue:
      items = [ExceptionTypeEnum.RevenueToExcluded, ExceptionTypeEnum.RevenueToOverhead];
      break;
    case DepartmentTypeEnum.Overhead:
      items = [ExceptionTypeEnum.OverheadToExcluded, ExceptionTypeEnum.OverheadToRevenue];
      break;
    case DepartmentTypeEnum.Excluded:
      items = [ExceptionTypeEnum.ExcludedToOverhead, ExceptionTypeEnum.ExcludedToRevenue];
      break;
    default:
      items = [
        ExceptionTypeEnum.RevenueToExcluded,
        ExceptionTypeEnum.RevenueToOverhead,
        ExceptionTypeEnum.OverheadToExcluded,
        ExceptionTypeEnum.OverheadToRevenue,
        ExceptionTypeEnum.ExcludedToOverhead,
        ExceptionTypeEnum.ExcludedToRevenue
      ];
      break;
  }
  return items;
};
