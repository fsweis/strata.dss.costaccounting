import React, { useState, useEffect } from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import { IDepartment } from './data/IDepartment';

export interface IFilteredDepartmentsProps {
  departments: IDepartment[];
}
const FilteredDepartments: React.FC<IFilteredDepartmentsProps> = (props: IFilteredDepartmentsProps) => {
  const { departments } = props;
  return (
    <>
      <DataGrid
        value={departments}
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
