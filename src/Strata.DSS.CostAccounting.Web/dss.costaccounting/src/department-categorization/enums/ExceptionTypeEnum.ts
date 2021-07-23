import { DepartmentTypeEnum } from './DepartmentTypeEnum';

export enum ExceptionTypeEnum {
  RevenueToOverhead = 0,
  RevenueToExcluded = 1,
  OverheadToRevenue = 2,
  OverheadToExcluded = 3,
  ExcludedToOverhead = 4,
  ExcludedToRevenue = 5,
  IncludedToExcluded = 9,
  ExcludedToIncluded = 10
}

export const getExceptionName = (value: ExceptionTypeEnum): string => {
  switch (value) {
    case ExceptionTypeEnum.RevenueToOverhead:
      return 'Revenue to Overhead';
    case ExceptionTypeEnum.RevenueToExcluded:
      return 'Revenue to Excluded';
    case ExceptionTypeEnum.OverheadToRevenue:
      return 'Overhead to Revenue';
    case ExceptionTypeEnum.OverheadToExcluded:
      return 'Overhead to Excluded';
    case ExceptionTypeEnum.ExcludedToOverhead:
      return 'Excluded to Overhead';
    case ExceptionTypeEnum.ExcludedToRevenue:
      return 'Excluded to Revenue';
    case ExceptionTypeEnum.IncludedToExcluded:
      return 'Included to Excluded';
    case ExceptionTypeEnum.ExcludedToIncluded:
      return 'Excluded to Included';
    default:
      return ExceptionTypeEnum[value];
  }
};

export const getExceptionType = (orignal: DepartmentTypeEnum, exception: DepartmentTypeEnum): ExceptionTypeEnum | undefined => {
  if (orignal === DepartmentTypeEnum.Revenue) {
    if (exception === DepartmentTypeEnum.Overhead) {
      return ExceptionTypeEnum.RevenueToOverhead;
    } else if (exception === DepartmentTypeEnum.Excluded) {
      return ExceptionTypeEnum.RevenueToExcluded;
    }
  }

  if (orignal === DepartmentTypeEnum.Overhead) {
    if (exception === DepartmentTypeEnum.Revenue) {
      return ExceptionTypeEnum.OverheadToRevenue;
    } else if (exception === DepartmentTypeEnum.Excluded) {
      return ExceptionTypeEnum.OverheadToExcluded;
    }
  }

  if (orignal === DepartmentTypeEnum.Excluded) {
    if (exception === DepartmentTypeEnum.Revenue) {
      return ExceptionTypeEnum.ExcludedToRevenue;
    } else if (exception === DepartmentTypeEnum.Overhead) {
      return ExceptionTypeEnum.ExcludedToOverhead;
    }
  }

  return undefined;
};

export const getExceptionDepartment = (exception: ExceptionTypeEnum): DepartmentTypeEnum => {
  switch (exception) {
    case ExceptionTypeEnum.OverheadToRevenue:
    case ExceptionTypeEnum.ExcludedToRevenue:
      return DepartmentTypeEnum.Revenue;
    case ExceptionTypeEnum.ExcludedToOverhead:
    case ExceptionTypeEnum.RevenueToOverhead:
      return DepartmentTypeEnum.Overhead;
    case ExceptionTypeEnum.OverheadToExcluded:
    case ExceptionTypeEnum.RevenueToExcluded:
      return DepartmentTypeEnum.Excluded;
    default:
      //should never hit this
      return DepartmentTypeEnum.Revenue;
  }
};
