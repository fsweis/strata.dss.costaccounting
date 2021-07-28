import { ExceptionTypeEnum } from './ExceptionTypeEnum';

export enum DepartmentTypeEnum {
  Revenue = 0,
  Overhead = 1,
  Excluded = 2,
  RevenueAndOverhead = 3,
  ClaimsIncluded = 4,
  ClaimsExcluded = 5,
  // For UI Only
  NotSpecified
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

export const calculateExceptionType = (orignal: DepartmentTypeEnum, exception: DepartmentTypeEnum): ExceptionTypeEnum | undefined => {
  if (orignal === DepartmentTypeEnum.Revenue) {
    if (exception === DepartmentTypeEnum.Overhead) {
      return ExceptionTypeEnum.RevenueToOverhead;
    } else {
      return ExceptionTypeEnum.RevenueToExcluded;
    }
  }

  if (orignal === DepartmentTypeEnum.Overhead) {
    if (exception === DepartmentTypeEnum.Revenue) {
      return ExceptionTypeEnum.OverheadToRevenue;
    } else {
      return ExceptionTypeEnum.OverheadToExcluded;
    }
  }

  if (orignal === DepartmentTypeEnum.Excluded) {
    if (exception === DepartmentTypeEnum.Revenue) {
      return ExceptionTypeEnum.ExcludedToRevenue;
    } else {
      return ExceptionTypeEnum.ExcludedToOverhead;
    }
  }

  return ExceptionTypeEnum.NotSpecified;
};
