import { IDepartment } from './IDepartment';
import { appConfig, getSecureService } from '@strata/core/lib';
import { DepartmentTypeEnum, calculateExceptionType } from '../enums/DepartmentTypeEnum';
import { ICostingDepartmentTypeExceptionData } from './ICostingDepartmentTypeExceptionData';
import { getNewGuid } from '../../shared/Utils';
import { ICostingDepartmentTypeExceptionSaveData } from './ICostingDepartmentTypeExceptionSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const departmentCategorizationService = {
  getDepartmentExceptions: async (costingConfigGuid: string): Promise<ICostingDepartmentTypeExceptionData[]> => {
    const exceptions = await httpGet<ICostingDepartmentTypeExceptionData[]>(`department-categorization/${costingConfigGuid}/exceptions`);
    exceptions.forEach((e) => {
      e.displayId = getNewGuid();
      e.exceptionType = calculateExceptionType(e.originalDepartmentTypeAsEnum, e.departmentTypeEnum);
    });
    return exceptions;
  },

  getDepartmentsByType: (costingConfigGuid: string, departmentType: DepartmentTypeEnum): Promise<IDepartment[]> => {
    // const filterDepartments = mockDepartmentData.filter((dept) => dept.departmentType === departmentType);
    // return Promise.resolve(filterDepartments);
    return httpGet<IDepartment[]>(`department-categorization/${costingConfigGuid}/filtered-departments/${departmentType}`);
  },

  getDepartments: (costingConfigGuid: string): Promise<IDepartment[]> => {
    return httpGet<IDepartment[]>('department-categorization/departments');
  },

  saveDepartementExceptions: async (updatedExceptions: ICostingDepartmentTypeExceptionSaveData): Promise<ICostingDepartmentTypeExceptionData[]> => {
    const exceptions = await httpPost<ICostingDepartmentTypeExceptionData[]>('department-categorization/', updatedExceptions);
    exceptions.forEach((e) => {
      e.displayId = getNewGuid();
      e.exceptionType = calculateExceptionType(e.originalDepartmentTypeAsEnum, e.departmentTypeEnum);
    });
    return exceptions;
  }
};
