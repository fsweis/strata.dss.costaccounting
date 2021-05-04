import React from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import { IExampleUserData } from './data/IExampleUserData';
import { useEffect, useState } from 'react';
import { exampleUserService } from './data/exampleUserService';

const ExampleUser: React.FC = () => {
  const [exampleUserData, setExampleUserData] = useState<IExampleUserData[] | []>();

  useEffect(() => {
    // runs once when component mounts
    const fetchData = async () => {
      setExampleUserData(await exampleUserService.getUsers());
    };
    fetchData();
  }, []);

  return (
    <>
      <DataGrid key='UserGrid' value={exampleUserData} sortOrder={1} sortField='firstName'>
        <DataGrid.RowNumber key='numberRow'></DataGrid.RowNumber>
        <DataGrid.Column key='firstName' header='First Name' filter field='firstName' sortable width={200} />
        <DataGrid.Column key='lastName' header='Last Name' filter field='lastName' sortable width={200} />
        <DataGrid.Column key='userGuid' header='User Guid' filter field='userGuid' sortable width={300} />
        <DataGrid.EmptyColumn />
      </DataGrid>
    </>
  );
};

export default ExampleUser;
