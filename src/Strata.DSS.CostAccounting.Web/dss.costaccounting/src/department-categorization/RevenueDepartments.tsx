import React from 'react';
import Button from '@strata/tempo/lib/button';
import DataGrid from '@strata/tempo/lib/datagrid';
import { IDepartment } from './data/IDepartment';

export interface IRevenueDepartmentsProps {
  revenueDepartments: IDepartment[];
}
const RevenueDepartments: React.FC<IRevenueDepartmentsProps> = (props: IRevenueDepartmentsProps) => {
  return (
    <>
      <DataGrid
        value={props.revenueDepartments}
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

export default RevenueDepartments;
