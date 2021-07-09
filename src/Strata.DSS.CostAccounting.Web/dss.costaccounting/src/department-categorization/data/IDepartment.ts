import { ICostingDepartmentTypeException } from './ICostingDepartmentTypeException';

export interface IDepartment {
  departmentId: number;
  departmentCode: string;
  departmentType: string;
  description: string;
  name: string;
  isClaimsCosting: number;
  costingDepartmentTypeException: ICostingDepartmentTypeException | null;
}

export const newDepartment = (department: Partial<IDepartment> = {}): IDepartment => {
  return {
    ...{
      departmentId: 0,
      departmentCode: '',
      description: '',
      name: '',
      isClaimsCosting: 0,
      departmentType: '',
      costingDepartmentTypeException: {
        costingDepartmentExceptionTypeId: 0,
        departmentId: 0,
        costingConfigGuid: '',
        departmentTypeEnum: 0,
        costingDepartmentType: '',
        deptExceptionTypeName: '',
        deptExceptionType: 0
      }
    },
    ...department
  };
};
