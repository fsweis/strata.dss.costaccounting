export interface ICostingDepartmentTypeException {
  costingDepartmentExceptionTypeId: number;
  departmentId: number;
  costingConfigGuid: string;
  departmentTypeEnum: number;
  name: string;
  deptExceptionType: number;
  deptExceptionTypeName: string;
  originalDepartmentType: string;
}
export const newDepartmentException = (exception: Partial<ICostingDepartmentTypeException> = {}): ICostingDepartmentTypeException => {
  return {
    ...{
      costingDepartmentExceptionTypeId: 0,
      departmentId: 0,
      costingConfigGuid: '',
      departmentTypeEnum: 0,
      name: '',
      deptExceptionType: 0,
      deptExceptionTypeName: '',
      originalDepartmentType: ''
    },
    ...exception
  };
};
