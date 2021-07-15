import { IDepartment } from './IDepartment';
import { ExceptionNameEnum } from '../enums/ExceptionNameEnum';
import { ExceptionTypeEnum } from '../enums/ExceptionTypeEnum';
import { DepartmentNameEnum } from '../enums/DepartmentNameEnum';
import { ICostingDepartmentTypeException } from './ICostingDepartmentTypeException';
import { getNewGuid } from '../../shared/Utils';
const mockDepartmentData: IDepartment[] = [
  {
    departmentId: 20929,
    departmentCode: 'Commercial',
    description: 'Line of Business for Claims Costing',
    name: 'Commercial - Line of Business for Claims Costing',
    isClaimsCosting: 0,
    departmentType: DepartmentNameEnum.Revenue
  },
  {
    departmentId: 20841,
    departmentCode: '59 - 0101',
    description: 'FAMILY PRACTICE',
    name: '59 - 0101 - FAMILY PRACTICE',
    isClaimsCosting: 0,
    departmentType: DepartmentNameEnum.Revenue
  },
  {
    departmentId: 50208,
    departmentCode: '08_12__F03MBS12_LFF__',
    description: 'FAMILY PRACTICE',
    name: '08_12__F03MBS12_LFF__ - 08_12__1403 MED BLDG S12_LIC FEE 1n1o7__',
    isClaimsCosting: 0,

    departmentType: DepartmentNameEnum.Overhead
  },
  {
    departmentId: 50256,
    departmentCode: '08_10__20CAJS10___',
    description: '08_10__20 CLMS ADJ LN 20A S10___',
    name: '08_10__20CAJS10___ - 08_10__20 CLMS ADJ LN 20A S10___',
    isClaimsCosting: 0,
    departmentType: DepartmentNameEnum.Overhead
  },
  {
    departmentId: 1749,
    departmentCode: '8106006581',
    description: 'Aloha Dental Facility Maintenance-Dental',
    name: '08106006581 - Aloha Dental Facility Maintenance-Dental',
    isClaimsCosting: 0,
    departmentType: DepartmentNameEnum.Overhead
  }
];

const mockExceptionData: ICostingDepartmentTypeException[] = [
  {
    displayId: getNewGuid(),
    costingDepartmentExceptionTypeId: 665,
    departmentId: 20841,
    costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
    name: '59 - 0101 - FAMILY PRACTICE',
    departmentTypeEnum: 1,
    originalDepartmentType: DepartmentNameEnum.Revenue,
    deptExceptionTypeName: ExceptionNameEnum.RevenueToOverhead,
    deptExceptionType: ExceptionTypeEnum.RevenueToOverhead
  },
  {
    displayId: getNewGuid(),
    costingDepartmentExceptionTypeId: 18326,
    departmentId: 50256,
    costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
    name: '08_10__20CAJS10___ - 08_10__20 CLMS ADJ LN 20A S10___',
    departmentTypeEnum: 2,
    originalDepartmentType: DepartmentNameEnum.Overhead,
    deptExceptionTypeName: ExceptionNameEnum.OverheadToExcluded,
    deptExceptionType: ExceptionTypeEnum.OverheadToExcluded
  },
  {
    displayId: getNewGuid(),
    costingDepartmentExceptionTypeId: 19810,
    departmentId: 1749,
    costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
    name: '08106006581 - Aloha Dental Facility Maintenance-Dental',
    departmentTypeEnum: 0,
    originalDepartmentType: DepartmentNameEnum.Overhead,
    deptExceptionTypeName: ExceptionNameEnum.OverheadToRevenue,
    deptExceptionType: ExceptionTypeEnum.OverheadToRevenue
  }
];

export const departmentCategorizationService = {
  getDepartmentExceptions: (costConfigGuid: string): Promise<ICostingDepartmentTypeException[]> => {
    //return httpGet<IMicroservice[]>('list');
    return Promise.resolve(mockExceptionData);
  },

  getDepartmentsByType: (costingConfigGuid: string, departmentType: DepartmentNameEnum): Promise<IDepartment[]> => {
    const filterDepartments = mockDepartmentData.filter((dept) => dept.departmentType === departmentType);
    return Promise.resolve(filterDepartments);
  },

  getDepartments: (costingConfigGuid: string): Promise<IDepartment[]> => {
    return Promise.resolve(mockDepartmentData);
  },

  saveDepartementExceptions: async (updatedExceptions: ICostingDepartmentTypeException[], deletedExceptions: number[]): Promise<ICostingDepartmentTypeException[]> => {
    deletedExceptions.forEach(function (departmentId) {
      const delIndex = mockExceptionData.findIndex((x) => x.departmentId === departmentId);
      if (delIndex > -1) {
        mockExceptionData.splice(delIndex, 1);
      }
    });
    updatedExceptions.forEach(function (exception) {
      if (exception.costingDepartmentExceptionTypeId == 0) {
        exception.costingDepartmentExceptionTypeId = exception.departmentId + 10;
      }
      const exceptionIndex = mockExceptionData.findIndex((x) => x.departmentId === exception.departmentId);
      if (exceptionIndex > -1) {
        mockExceptionData[exceptionIndex] = exception;
      } else {
        mockExceptionData.unshift(exception);
      }
    });

    return Promise.resolve(mockExceptionData);
  }
};
