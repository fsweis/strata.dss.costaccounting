import { IDepartment } from './IDepartment';

const mockData: IDepartment[] = [
  {
    departmentId: 20929,
    departmentCode: 'Commercial',
    description: 'Line of Business for Claims Costing',
    name: 'Commercial - Line of Business for Claims Costing',
    isClaimsCosting: 0,
    departmentType: 'Revenue',
    costingDepartmentTypeException: null
  },
  {
    departmentId: 20841,
    departmentCode: '59 - 0101',
    description: 'FAMILY PRACTICE',
    name: '59 - 0101 - FAMILY PRACTICE',
    isClaimsCosting: 0,
    departmentType: 'Revenue',
    costingDepartmentTypeException: {
      costingDepartmentExceptionTypeId: 665,
      departmentId: 20841,
      costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
      departmentTypeEnum: 1,
      costingDepartmentType: 'Revenue',
      deptExceptionTypeName: 'Revenue to Overhead',
      deptExceptionType: 1
    }
  },
  {
    departmentId: 50208,
    departmentCode: '08_12__F03MBS12_LFF__',
    description: 'FAMILY PRACTICE',
    name: '08_12__F03MBS12_LFF__ - 08_12__1403 MED BLDG S12_LIC FEE 1n1o7__',
    isClaimsCosting: 0,

    departmentType: 'Overhead',
    costingDepartmentTypeException: null
  },
  {
    departmentId: 50256,
    departmentCode: '08_10__20CAJS10___',
    description: '08_10__20 CLMS ADJ LN 20A S10___',
    name: '08_10__20CAJS10___ - 08_10__20 CLMS ADJ LN 20A S10___',
    isClaimsCosting: 0,
    departmentType: 'Overhead',
    costingDepartmentTypeException: {
      costingDepartmentExceptionTypeId: 18326,
      departmentId: 50256,
      costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
      departmentTypeEnum: 2,
      costingDepartmentType: 'Overhead',
      deptExceptionTypeName: 'Overhead to Excluded',
      deptExceptionType: 3
    }
  },
  {
    departmentId: 1749,
    departmentCode: '8106006581',
    description: 'Aloha Dental Facility Maintenance-Dental',
    name: '08106006581 - Aloha Dental Facility Maintenance-Dental',
    isClaimsCosting: 0,
    departmentType: 'Overhead',
    costingDepartmentTypeException: {
      costingDepartmentExceptionTypeId: 19810,
      departmentId: 1749,
      costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
      departmentTypeEnum: 2,
      costingDepartmentType: 'Overhead',
      deptExceptionTypeName: 'Overhead to Revenue',
      deptExceptionType: 2
    }
  }
];

export const departmentCategorizationService = {
  getDepartmentExceptions: (): Promise<IDepartment[]> => {
    //return httpGet<IMicroservice[]>('list');
    return Promise.resolve(mockData);
  },

  // getMicroservice: async (id: number): Promise<IMicroservice> => {
  //   //return await httpGet<IMicroservice>(`id=${id}`);
  //   return Promise.resolve(mockData.find((item) => item.microserviceId === id));
  // },

  saveMicroservice: async (department: IDepartment): Promise<IDepartment> => {
    if (department.departmentId === 0) {
      mockData.push(department);
      department.departmentId = mockData.length;
    }
    return Promise.resolve(department);
  }
};
