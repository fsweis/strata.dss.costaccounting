import React, { useState, useEffect } from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import { IDepartment } from './data/IDepartment';
import { DepartmentNameEnum } from './enums/DepartmentNameEnum';

export interface IFilteredDepartmentsProps {
  departments: IDepartment[];
  departmentType: DepartmentNameEnum;
}
const FilteredDepartments: React.FC<IFilteredDepartmentsProps> = (props: IFilteredDepartmentsProps) => {
  const [filteredDepartmentData, setFilteredDepartmentData] = useState<IDepartment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      /*//This will be handled on the backed
      const filterDepartments = props.departments.filter((dept) => dept.departmentType === props.departmentType);
      const overriddenFromFilteredDepartments = filterDeptArray(props.departments, props.departmentType, true);
      const overriddenToFilteredDepartments = filterDeptArray(props.departments, props.departmentType, false);
      const filteredDepartmentsToDisplay = filterDepartments.filter((dept) => !overriddenFromFilteredDepartments.includes(dept)).concat(overriddenToFilteredDepartments);
      setFilteredDepartmentData(filteredDepartmentsToDisplay);
      */
    };
    setFilteredDepartmentData(props.departments);
    fetchData();
  }, [props.departments, props.departmentType]);
  /*//This will be handled on the backed
  const filterDeptArray = (departmentArray: IDepartment[], deptType: string, overridden: boolean) => {
    if (overridden) {
      return departmentArray.filter(
        (dept) =>
          dept.departmentType === deptType &&
          dept.costingDepartmentTypeException !== null &&
          dept.costingDepartmentTypeException !== undefined &&
          !dept.costingDepartmentTypeException.deptExceptionTypeName.includes('to ' + deptType)
      );
    } else {
      return departmentArray.filter(
        (dept) =>
          dept.departmentType !== deptType &&
          dept.costingDepartmentTypeException !== null &&
          dept.costingDepartmentTypeException !== undefined &&
          dept.costingDepartmentTypeException.deptExceptionTypeName.includes('to ' + deptType)
      );
    }
  };
*/
  return (
    <>
      <DataGrid
        value={filteredDepartmentData}
        pager={{
          pageSize: 100
        }}
      >
        <DataGrid.RowNumber />
        <DataGrid.Column header='Department' field='name' filter width={480} />
        <DataGrid.EmptyColumn />
      </DataGrid>
    </>
  );
};

export default FilteredDepartments;
