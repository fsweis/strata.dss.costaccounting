import React from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import Header from '@strata/tempo/lib/header';
import { Tooltip, Button, Toast, ActionBar, Spacing, DropDown } from '@strata/tempo/lib';
import { IStatisticDriverData } from './data/IStatisticDriverData';
import { useEffect, useState } from 'react';
import { statisticDriverService } from './data/statisticDriverService';

const StatisticDrivers: React.FC = () => {
  const [statDriverData, setStatDriverData] = useState<IStatisticDriverData>();
  const gridRef = React.useRef();

  useEffect(() => {
    // runs once when component mounts
    const fetchData = async () => {
      setStatDriverData(await statisticDriverService.getStatisticDrivers());
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    //setData(origData);
    Toast.show({
      message: 'Changes discarded'
    });
  };

  const handleSave = () => {
    /*
    if(gridRef!==null)
    {
      current.validateGrid().then((invalidCells: any[]) => {
        if (invalidCells.length > 0) {
          const invalidKeys = invalidCells.map((cell) => cell.rowKey);
          const invalidRows = statDriverData?.statisticDrivers.filter((row) => invalidKeys.includes(row.driverConfigGUID));
          const invalidNames = invalidRows
            .map((row) => row.name)
            .sort()
            .join(', ');
  
          Modal.alert({
            title: 'Changes not saved',
            content: 'Fix errors in ' + invalidNames + '.',
            alertType: 'error'
          });
        } else {
          Toast.show({
            toastType: 'success',
            message: 'Changes saved'
          });
        }
      });
    }
    */
  };

  return (
    <>
      <Header
        title='Statistic Drivers'
        extra={
          <Spacing itemSpacing={16} wrap={16} vAlign='center'>
            <DropDown width={200} defaultValue='Reports' items={[{ text: 'Statistic Drivers Report', value: 1 }]} />
            <Button type='tertiary' icon='InfoCircle' />
          </Spacing>
        }
      />
      <ActionBar
        actions={
          <>
            <Button icon='Plus'>Add Driver</Button>
            <Button icon='DoubleRight'>Run Patient Drivers</Button>
          </>
        }
      />
      <DataGrid
        key='StatDriverGrid'
        ref={gridRef.current}
        value={statDriverData?.statisticDrivers}
        sortOrder={1}
        sortField='name'
        pager={{
          pageSize: 10,
          extra: (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type='primary' onClick={handleSave}>
                Save
              </Button>
            </>
          )
        }}
      >
        <DataGrid.RowNumber key='numberRow'></DataGrid.RowNumber>
        <DataGrid.Column key='name' header='Name' filter field='name' sortable width={200} />
        <DataGrid.DropDownColumn
          key='dataSource'
          field='dataTableGUID'
          header='Data Source'
          editable
          filter
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
          filter
          width={300}
          itemValueField='measureGUID'
          itemTextField='friendlyName'
          items={statDriverData?.dataSourceLinks}
        />
        <DataGrid.CheckboxColumn key='inverted' header='Inverted' editable field='isInverted' sortable width={150} />
        <DataGrid.EmptyColumn />
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
      </DataGrid>
    </>
  );
};

export default StatisticDrivers;
