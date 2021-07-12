import { IDepartment } from './IDepartment';
import { ExceptionNameEnum } from '../enums/ExceptionNameEnum';
import { ExceptionTypeEnum } from '../enums/ExceptionTypeEnum';
import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';
const mockData: IDepartment[] = [
  {
    departmentId: 20929,
    departmentCode: 'Commercial',
    description: 'Line of Business for Claims Costing',
    name: 'Commercial - Line of Business for Claims Costing',
    isClaimsCosting: 0,
    departmentType: DepartmentTypeEnum.Revenue,
    costingDepartmentTypeException: null
  },
  {
    departmentId: 20841,
    departmentCode: '59 - 0101',
    description: 'FAMILY PRACTICE',
    name: '59 - 0101 - FAMILY PRACTICE',
    isClaimsCosting: 0,
    departmentType: DepartmentTypeEnum.Revenue,
    costingDepartmentTypeException: {
      costingDepartmentExceptionTypeId: 665,
      departmentId: 20841,
      costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
      departmentTypeEnum: 1,
      costingDepartmentType: DepartmentTypeEnum.Revenue,
      deptExceptionTypeName: ExceptionNameEnum.RevenueToOverhead,
      deptExceptionType: ExceptionTypeEnum.RevenueToOverhead
    }
  },
  {
    departmentId: 50208,
    departmentCode: '08_12__F03MBS12_LFF__',
    description: 'FAMILY PRACTICE',
    name: '08_12__F03MBS12_LFF__ - 08_12__1403 MED BLDG S12_LIC FEE 1n1o7__',
    isClaimsCosting: 0,

    departmentType: DepartmentTypeEnum.Overhead,
    costingDepartmentTypeException: null
  },
  {
    departmentId: 50256,
    departmentCode: '08_10__20CAJS10___',
    description: '08_10__20 CLMS ADJ LN 20A S10___',
    name: '08_10__20CAJS10___ - 08_10__20 CLMS ADJ LN 20A S10___',
    isClaimsCosting: 0,
    departmentType: DepartmentTypeEnum.Overhead,
    costingDepartmentTypeException: {
      costingDepartmentExceptionTypeId: 18326,
      departmentId: 50256,
      costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
      departmentTypeEnum: 2,
      costingDepartmentType: DepartmentTypeEnum.Overhead,
      deptExceptionTypeName: ExceptionNameEnum.OverheadToExcluded,
      deptExceptionType: ExceptionTypeEnum.OverheadToExcluded
    }
  },
  {
    departmentId: 1749,
    departmentCode: '8106006581',
    description: 'Aloha Dental Facility Maintenance-Dental',
    name: '08106006581 - Aloha Dental Facility Maintenance-Dental',
    isClaimsCosting: 0,
    departmentType: DepartmentTypeEnum.Overhead,
    costingDepartmentTypeException: {
      costingDepartmentExceptionTypeId: 19810,
      departmentId: 1749,
      costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
      departmentTypeEnum: 2,
      costingDepartmentType: DepartmentTypeEnum.Overhead,
      deptExceptionTypeName: ExceptionNameEnum.OverheadToRevenue,
      deptExceptionType: ExceptionTypeEnum.OverheadToRevenue
    }
  }
];

export const departmentCategorizationService = {
  getDepartmentExceptions: (): Promise<IDepartment[]> => {
    //return httpGet<IMicroservice[]>('list');
    return Promise.resolve(mockData);
  },

  saveDepartementExceptions: async (updatedExceptions: IDepartment[], deletedExceptions: number[]): Promise<IDepartment[]> => {
    console.log(updatedExceptions, deletedExceptions);
    deletedExceptions.forEach(function (departmentId) {
      const delIndex = mockData.findIndex((x) => x.departmentId === departmentId);
      if (delIndex > -1) {
        mockData.splice(delIndex, 1);
      }
    });
    updatedExceptions.forEach(function (department) {
      const depIndex = mockData.findIndex((x) => x.departmentId === department.departmentId);
      if (depIndex > -1) {
        mockData.splice(depIndex, 1);
      }
    });
    mockData.push(...updatedExceptions);

    return Promise.resolve(mockData);
  }
};
