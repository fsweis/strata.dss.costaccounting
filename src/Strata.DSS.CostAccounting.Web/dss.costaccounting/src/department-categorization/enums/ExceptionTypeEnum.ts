import { DepartmentTypeEnum } from './DepartmentTypeEnum';

export enum ExceptionTypeEnum {
  RevenueToOverhead = 0,
  RevenueToExcluded = 1,
  OverheadToRevenue = 2,
  OverheadToExcluded = 3,
  ExcludedToOverhead = 4,
  ExcludedToRevenue = 5,
  IncludedToExcluded = 9,
  ExcludedToIncluded = 10,
  NotSpecified
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
      return 'Not Specified';
  }
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
