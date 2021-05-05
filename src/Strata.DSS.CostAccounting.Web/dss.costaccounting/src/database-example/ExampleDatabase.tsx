import React from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import ActionBar from '@strata/tempo/lib/actionbar';
import Button from '@strata/tempo/lib/button';
import Modal from '@strata/tempo/lib/modal';
import Header from '@strata/tempo/lib/header';
import { exampleDatabaseService } from './data/exampleDatabaseService';
import { IExampleDatabaseData } from './data/IExampleDatabaseData';
import { useEffect, useState } from 'react';

function infoAlert(message: string) {
  Modal.alert({
    title: 'Example pop up',
    content: message,
    onClose() {
      console.log('Info Alert closed');
    }
  });
}

const ExampleDatabase: React.FC = () => {
  const [exampleDBData, setExampleDBData] = useState<IExampleDatabaseData[] | []>();

  useEffect(() => {
    // runs once when component mounts
    const fetchData = async () => {
      setExampleDBData(await exampleDatabaseService.getDatabases());
    };
    fetchData();
  }, []);

  return (
    <>
      <Header title='Databases' />
      <ActionBar actions={<Button onClick={() => infoAlert('Hello!')}>Click me</Button>} />
      <DataGrid key='DatabaseGrid' value={exampleDBData} sortOrder={1} sortField='databaseName'>
        <DataGrid.RowNumber key='numberRow'></DataGrid.RowNumber>
        <DataGrid.Column key='databaseName' header='Name' filter field='databaseName' sortable width={200} />
        <DataGrid.Column key='databaseGuid' header='Database Guid' filter field='databaseGuid' sortable width={300} />
        <DataGrid.CheckboxColumn key='isClientDB' filter header='Client Database' width={140} field='isClientDB' sortable />
        <DataGrid.EmptyColumn />
      </DataGrid>
    </>
  );
};

export default ExampleDatabase;
