import React, { useState, useEffect, useContext } from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import { IDepartment } from './data/IDepartment';
import { DepartmentTypeEnum } from './enums/DepartmentTypeEnum';
import { departmentCategorizationService } from './data/departmentCategorizationService';
import { CostingConfigContext } from '../shared/data/CostingConfigContext';

export interface IFilteredDepartmentsProps {
  departmentType: DepartmentTypeEnum;
}
const FilteredDepartments: React.FC<IFilteredDepartmentsProps> = (props: IFilteredDepartmentsProps) => {
  const [filteredDepartmentData, setFilteredDepartmentData] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { costingConfig } = useContext(CostingConfigContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!costingConfig) {
        return;
      }
      try {
        setIsLoading(true);
        const departments = await departmentCategorizationService.getDepartmentsByType(costingConfig?.costingConfigGuid, props.departmentType);
        setFilteredDepartmentData(departments);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [costingConfig, props.departmentType]);

  return (
    <>
      <DataGrid
        scrollable
        loading={isLoading}
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
