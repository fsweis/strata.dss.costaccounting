import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';

export interface IDepartment {
  departmentId: number;
  departmentCode: string;
  departmentType: DepartmentTypeEnum;
  description: string;
  name: string;
  isClaimsCosting: boolean;
}

export const newDepartment = (department: Partial<IDepartment> = {}): IDepartment => {
  return {
    ...{
      departmentId: 0,
      departmentCode: '',
      description: '',
      name: '',
      isClaimsCosting: false,
      departmentType: DepartmentTypeEnum.Revenue
    },
    ...department
  };
};
