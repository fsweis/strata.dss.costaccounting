import React from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import Header from '@strata/tempo/lib/header';
import { Tooltip, Button } from '@strata/tempo/lib';
import { IStatisticDriverData } from './data/IStatisticDriverData';
import { useEffect, useState } from 'react';
import { statisticDriverService } from './data/statisticDriverService';

const StatisticDrivers: React.FC = () => {
  const [statDriverData, setStatDriverData] = useState<IStatisticDriverData>();

  useEffect(() => {
    // runs once when component mounts
    const fetchData = async () => {
      setStatDriverData(await statisticDriverService.getStatisticDrivers());
    };
    fetchData();
  }, []);

  return (
    <>
      <Header title='Statistic Drivers' />
      <DataGrid key='StatDriverGrid' value={statDriverData?.statisticDrivers} sortOrder={1} sortField='name'>
        <DataGrid.RowNumber key='numberRow'></DataGrid.RowNumber>
        <DataGrid.Column key='name' header='Name' filter field='name' sortable width={200} />
        <DataGrid.DropDownColumn
          key='dataSource'
          field='dataTableGUID'
          header='Data Source'
          editable
          sortable
          width={300}
          itemValueField='dataTableGUID'
          itemTextField='friendlyName'
          items={statDriverData?.dataSources}
        />
        <DataGrid.DropDownColumn
          key='measure'
          field='measureGUID'
          header='Measure'
          editable
          sortable
          width={300}
          itemValueField='measureGUID'
          itemTextField='friendlyName'
          items={statDriverData?.dataSourceLinks}
        />
        <DataGrid.CheckboxColumn key='inverted' header='Inverted' filter editable field='isInverted' sortable width={150} />
        <DataGrid.Column
          align='right'
          width={80}
          body={(rowData) => (
            <>
              <Tooltip title='Edit Rules'>
                <Button type='link' icon='Edit' onClick={() => alert('Edit ' + rowData.name)} />
              </Tooltip>
              <Tooltip title='Delete'>
                <Button type='link' icon='Delete' onClick={() => alert('Delete ' + rowData.name)} />
              </Tooltip>
            </>
          )}
        />
        <DataGrid.EmptyColumn />
      </DataGrid>
    </>
  );
};

export default StatisticDrivers;
