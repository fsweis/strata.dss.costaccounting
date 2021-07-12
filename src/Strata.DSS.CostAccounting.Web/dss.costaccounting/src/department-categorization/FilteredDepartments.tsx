import React, { useState, useEffect } from 'react';
import Button from '@strata/tempo/lib/button';
import DataGrid from '@strata/tempo/lib/datagrid';
import { IDepartment } from './data/IDepartment';
import { DepartmentTypeEnum } from './enums/DepartmentTypeEnum';

export interface IFilteredDepartmentsProps {
  departments: IDepartment[];
  departmentType: DepartmentTypeEnum;
}
const FilteredDepartments: React.FC<IFilteredDepartmentsProps> = (props: IFilteredDepartmentsProps) => {
  const [filteredDepartmentData, setFilteredDepartmentData] = useState<IDepartment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const filterDepartments = props.departments.filter((dept) => dept.departmentType === props.departmentType);
      const overriddenFromFilteredDepartments = filterDeptArray(props.departments, props.departmentType, true);
      const overriddenToFilteredDepartments = filterDeptArray(props.departments, props.departmentType, false);
      const filteredDepartmentsToDisplay = filterDepartments.filter((dept) => !overriddenFromFilteredDepartments.includes(dept)).concat(overriddenToFilteredDepartments);
      setFilteredDepartmentData(filteredDepartmentsToDisplay);
    };

    fetchData();
  }, [props.departments, props.departmentType]);

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

  return (
    <>
      <DataGrid
        value={filteredDepartmentData}
        pager={{
          pageSize: 100,
          extra: (
            <>
              <Button>Cancel</Button>
              <Button type='primary'>Save</Button>
            </>
          )
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
