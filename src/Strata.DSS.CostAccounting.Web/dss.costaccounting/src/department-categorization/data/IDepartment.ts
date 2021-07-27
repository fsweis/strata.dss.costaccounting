import { DepartmentTypeEnum } from '../enums/DepartmentTypeEnum';

export interface IDepartment {
  departmentId: number;
  departmentCode: string;
  departmentType: string;
  description: string;
  name: string;
  isClaimsCosting: boolean;
  departmentTypeAsEnum: DepartmentTypeEnum;
}

export const newDepartment = (department: Partial<IDepartment> = {}): IDepartment => {
  return {
    ...{
      departmentId: 0,
      departmentCode: '',
      description: '',
      name: '',
      isClaimsCosting: false,
      departmentType: '',
      departmentTypeAsEnum: DepartmentTypeEnum.NotSpecified
    },
    ...department
  };
};
