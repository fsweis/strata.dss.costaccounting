import React from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import Header from '@strata/tempo/lib/header';
import { Tooltip, Button, Toast, ActionBar, Spacing, DropDown, IDropDownProps, Modal } from '@strata/tempo/lib';
import { IStatisticDriverData } from './data/IStatisticDriverData';
import { IStatisticDriver } from './data/IStatisticDriver';
import { useEffect, useState } from 'react';
import { statisticDriverService } from './data/statisticDriverService';
import { IDataSourceLink } from './data/IDataSourceLink';
import { IDataSource } from './data/IDataSource';

const StatisticDrivers: React.FC = () => {
  const [statDriverData, setStatDriverData] = useState<IStatisticDriverData>();
  const [statDrivers, setStatDrivers] = useState<IStatisticDriver[]>([]);

  const gridRef = React.useRef();

  useEffect(() => {
    // runs once when component mounts
    const fetchData = async () => {
      setStatDriverData(await statisticDriverService.getStatisticDrivers());
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (statDriverData?.statisticDrivers) {
      const statDrivers = statDriverData.statisticDrivers;
      setStatDrivers(statDrivers);
    }
  }, [statDriverData]);

  const handleCancel = () => {
    //setData(origData);
    Toast.show({
      message: 'Changes discarded'
    });
  };

  const handleAdd = () => {
    const newDriver: IStatisticDriver = {
      driverConfigGUID: '00000000-0000-0000-0000-000000000000',
      dataTableGUID: '',
      measureGUID: '',
      hasRules: false,
      isInverted: false,
      isNew: true,
      name: ''
    };
    if (statDrivers !== undefined) {
      const drivers = [newDriver].concat(statDrivers);
      setStatDrivers(drivers);
    }
  };

  const handleEditRules = function (driverConfigGUID: string) {
    const url = 'https://dev.sdt.local/StrataJazz202123/DSS/HealthPlan/Statistics/HealthPlanRulesEditWindow.aspx?hpAdminStatisticDriverGuid=' + driverConfigGUID;
    const winid = driverConfigGUID;
    const options = 'scrollbars=0,toolbar=0,location=0,statusbar=0,menubar=0, resizable=1,width=1000,height=700,left=50,top=50';
    const win = window.open(url, winid, options);
    win?.focus();
    return win;
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
            <Button icon='Plus' onClick={handleAdd}>
              Add Driver
            </Button>
            <Button icon='DoubleRight'>Run Patient Drivers</Button>
          </>
        }
      />
      <DataGrid
        dataKey='driverConfigGUID'
        key='StatDriverGrid'
        ref={gridRef.current}
        value={statDrivers}
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
        <DataGrid.Column key='name' header='Name' filter editable field='name' sortable width={200} />
        <DataGrid.DropDownColumn
          key='dataSource'
          field='dataTableGUID'
          header='Data Source'
          editable
          width={300}
          itemValueField='dataTableGUID'
          itemTextField='friendlyName'
          items={statDriverData?.dataSources}
          editor={(cellEditorArgs) => (
            <>
              <DropDown
                onChange={(value) => {
                  if (value !== cellEditorArgs.rowData.dataTableGUID) {
                    cellEditorArgs.rowData.dataTableGUID = value;
                    const defaultValue = statDriverData?.dataSourceLinks.filter((x) => x.dataTableGUID === value && x.isFirstSelect === true);
                    if (defaultValue !== undefined && defaultValue.length > 0) {
                      const updatedDrivers = statDrivers.map((driver) => {
                        if (driver.driverConfigGUID === cellEditorArgs.rowData.driverConfigGUID) {
                          return { ...driver, measureGUID: defaultValue[0].measureGUID };
                        }
                        return driver;
                      });
                      setStatDrivers(updatedDrivers);
                    } else {
                      const nonDefaultValue = statDriverData?.dataSourceLinks.filter((x) => x.dataTableGUID === value);
                      if (nonDefaultValue !== undefined && nonDefaultValue.length > 0) {
                        const updatedDrivers = statDrivers.map((driver) => {
                          if (driver.driverConfigGUID === cellEditorArgs.rowData.driverConfigGUID) {
                            return { ...driver, measureGUID: nonDefaultValue[0].measureGUID };
                          }
                          return driver;
                        });
                        setStatDrivers(updatedDrivers);
                      }
                    }
                  }
                }}
                width={300}
                itemValueField='dataTableGUID'
                itemTextField='friendlyName'
                items={statDriverData?.dataSources}
              />
            </>
          )}
        />
        <DataGrid.DropDownColumn
          key='dataSourceLink'
          field='measureGUID'
          header='Measure'
          editable
          width={300}
          itemValueField='measureGUID'
          itemTextField='friendlyName'
          items={statDriverData?.dataSourceLinks}
          editor={(cellEditorArgs) => (
            <>
              <DropDown
                onChange={(value) => {
                  cellEditorArgs.rowData.measureGUID = value;
                }}
                width={300}
                itemValueField='measureGUID'
                itemTextField='friendlyName'
                items={statDriverData?.dataSourceLinks.filter((x: IDataSourceLink) => {
                  return x.dataTableGUID === cellEditorArgs.rowData.dataTableGUID;
                })}
              />
            </>
          )}
        />
        <DataGrid.CheckboxColumn key='inverted' header='Inverted' editable field='isInverted' sortable width={150} />
        <DataGrid.EmptyColumn />
        <DataGrid.Column
          align='right'
          width={80}
          body={(rowData) => (
            <>
              <Tooltip title='Edit Rules'>
                <Button type='link' icon='Edit' onClick={() => handleEditRules(rowData.driverConfigGUID)} />
              </Tooltip>
              <Tooltip title='Delete'>
                <Button
                  type='link'
                  icon='Delete'
                  onClick={() =>
                    Modal.confirm({
                      title: 'Permanently delete ' + rowData.name + '?',
                      okText: 'Delete Driver',
                      cancelText: 'Keep Driver',
                      onOk() {
                        if (statDrivers !== undefined) {
                          const newStatDrivers = statDrivers.filter(function (obj) {
                            return obj.driverConfigGUID !== rowData.driverConfigGUID;
                          });
                          setStatDrivers(newStatDrivers);
                        }
                      },
                      onCancel() {
                        console.log('Changes kept');
                      }
                    })
                  }
                />
              </Tooltip>
            </>
          )}
        />
      </DataGrid>
    </>
  );
};

export default StatisticDrivers;
