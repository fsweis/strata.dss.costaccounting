import { IDepartment } from './IDepartment';
import { appConfig, getSecureService } from '@strata/core/lib';
import { ExceptionTypeEnum } from '../enums/ExceptionTypeEnum';
import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';
import { ICostingDepartmentTypeException } from './ICostingDepartmentTypeException';
import { getNewGuid } from '../../shared/Utils';
const { httpGet, httpPost, httpDelete } = getSecureService(appConfig.apiUrl);
const mockDepartmentData: IDepartment[] = [
  {
    departmentId: 20929,
    departmentCode: 'Commercial',
    description: 'Line of Business for Claims Costing',
    name: 'Commercial - Line of Business for Claims Costing',
    isClaimsCosting: false,
    departmentType: DepartmentTypeEnum.Revenue
  },
  {
    departmentId: 20841,
    departmentCode: '59 - 0101',
    description: 'FAMILY PRACTICE',
    name: '59 - 0101 - FAMILY PRACTICE',
    isClaimsCosting: false,
    departmentType: DepartmentTypeEnum.Revenue
  },
  {
    departmentId: 50208,
    departmentCode: '08_12__F03MBS12_LFF__',
    description: 'FAMILY PRACTICE',
    name: '08_12__F03MBS12_LFF__ - 08_12__1403 MED BLDG S12_LIC FEE 1n1o7__',
    isClaimsCosting: false,

    departmentType: DepartmentTypeEnum.Overhead
  },
  {
    departmentId: 50256,
    departmentCode: '08_10__20CAJS10___',
    description: '08_10__20 CLMS ADJ LN 20A S10___',
    name: '08_10__20CAJS10___ - 08_10__20 CLMS ADJ LN 20A S10___',
    isClaimsCosting: false,
    departmentType: DepartmentTypeEnum.Overhead
  },
  {
    departmentId: 1749,
    departmentCode: '8106006581',
    description: 'Aloha Dental Facility Maintenance-Dental',
    name: '08106006581 - Aloha Dental Facility Maintenance-Dental',
    isClaimsCosting: false,
    departmentType: DepartmentTypeEnum.Overhead
  }
];

const mockExceptionData: ICostingDepartmentTypeException[] = [
  {
    displayId: getNewGuid(),
    costingDepartmentExceptionTypeId: 665,
    departmentId: 20841,
    costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
    departmentName: '59 - 0101 - FAMILY PRACTICE',
    departmentTypeEnum: 1,
    originalDepartmentType: DepartmentTypeEnum.Revenue,
    exceptionType: ExceptionTypeEnum.RevenueToOverhead
  },
  {
    displayId: getNewGuid(),
    costingDepartmentExceptionTypeId: 18326,
    departmentId: 50256,
    costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
    departmentName: '08_10__20CAJS10___ - 08_10__20 CLMS ADJ LN 20A S10___',
    departmentTypeEnum: 2,
    originalDepartmentType: DepartmentTypeEnum.Overhead,
    exceptionType: ExceptionTypeEnum.OverheadToExcluded
  },
  {
    displayId: getNewGuid(),
    costingDepartmentExceptionTypeId: 19810,
    departmentId: 1749,
    costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
    departmentName: '08106006581 - Aloha Dental Facility Maintenance-Dental',
    departmentTypeEnum: 0,
    originalDepartmentType: DepartmentTypeEnum.Overhead,
    exceptionType: ExceptionTypeEnum.OverheadToRevenue
  }
];

export const departmentCategorizationService = {
  getDepartmentExceptions: async (costingConfigGuid: string): Promise<ICostingDepartmentTypeException[]> => {
    //return httpGet<IMicroservice[]>('list');
    //TODO make sure to initialize the displayId //forEach((exc) => (exc.displayId = getNewGuid()));
    //return Promise.resolve(mockExceptionData);
    const exceptions = await httpGet<ICostingDepartmentTypeException[]>(`department-categorization/${costingConfigGuid}/exceptions`);
    exceptions.forEach((e) => (e.displayId = getNewGuid()));
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

  saveDepartementExceptions: async (updatedExceptions: ICostingDepartmentTypeException[], deletedExceptions: number[]): Promise<ICostingDepartmentTypeException[]> => {
    // deletedExceptions.forEach(function (departmentId) {
    //   const delIndex = mockExceptionData.findIndex((x) => x.departmentId === departmentId);
    //   if (delIndex > -1) {
    //     mockExceptionData.splice(delIndex, 1);
    //   }
    // });
    const deleteConfigInit: RequestInit = {
      method: 'DELETE',
      body: JSON.stringify(deletedExceptions)
    };

    httpDelete(`department-categorization/`, deleteConfigInit);

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
    const updateConfigInit: RequestInit = {
      method: 'POST',
      body: JSON.stringify(updatedExceptions)
    };

    httpPost(`department-categorization/`, updateConfigInit);

    return Promise.resolve(mockExceptionData);
  }
};
