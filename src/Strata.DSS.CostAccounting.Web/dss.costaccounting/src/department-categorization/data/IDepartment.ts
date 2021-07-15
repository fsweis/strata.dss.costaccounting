import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';

export interface IDepartment {
  departmentId: number;
  departmentCode: string;
  departmentType: DepartmentTypeEnum;
  description: string;
  name: string;
  isClaimsCosting: number;
}

export const newDepartment = (department: Partial<IDepartment> = {}): IDepartment => {
  return {
    ...{
      departmentId: 0,
      departmentCode: '',
      description: '',
      name: '',
      isClaimsCosting: 0,
      departmentType: DepartmentTypeEnum.Revenue
    },
    ...department
  };
};
