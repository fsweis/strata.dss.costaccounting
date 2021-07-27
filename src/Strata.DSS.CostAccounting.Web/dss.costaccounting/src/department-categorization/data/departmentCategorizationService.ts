import { IDepartment } from './IDepartment';
import { appConfig, getSecureService } from '@strata/core/lib';
import { DepartmentTypeEnum, calculateExceptionType } from '../enums/DepartmentTypeEnum';
import { ICostingDepartmentTypeExceptionData } from './ICostingDepartmentTypeExceptionData';
import { getNewGuid } from '../../shared/Utils';
import { ICostingDepartmentTypeExceptionSaveData } from './ICostingDepartmentTypeExceptionSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const departmentCategorizationService = {
  getDepartmentExceptions: async (costingConfigGuid: string): Promise<ICostingDepartmentTypeExceptionData[]> => {
    //return httpGet<IMicroservice[]>('list');
    //TODO make sure to initialize the displayId //forEach((exc) => (exc.displayId = getNewGuid()));
    //return Promise.resolve(mockExceptionData);
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
    // updatedExceptions.forEach(function (exception) {
    //   if (exception.costingDepartmentExceptionTypeId === 0) {
    //     exception.costingDepartmentExceptionTypeId = exception.departmentId + 10;
    //   }
    //   const exceptionIndex = mockExceptionData.findIndex((x) => x.departmentId === exception.departmentId);
    //   if (exceptionIndex > -1) {
    //     mockExceptionData[exceptionIndex] = exception;
    //   } else {
    //     mockExceptionData.unshift(exception);
    //   }
    // });
    const exceptions = await httpPost<ICostingDepartmentTypeExceptionData[]>('department-categorization/', updatedExceptions);
    exceptions.forEach((e) => {
      e.displayId = getNewGuid();
      e.exceptionType = calculateExceptionType(e.originalDepartmentTypeAsEnum, e.departmentTypeEnum);
    });
    return exceptions;
  }
};
