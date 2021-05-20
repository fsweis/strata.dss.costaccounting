import React from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import Header from '@strata/tempo/lib/header';
import Tooltip from '@strata/tempo/lib/tooltip';
import Button from '@strata/tempo/lib/button';
import Toast from '@strata/tempo/lib/toast';
import ActionBar from '@strata/tempo/lib/actionbar';
import Spacing from '@strata/tempo/lib/spacing';
import DropDown from '@strata/tempo/lib/dropdown';
import Modal from '@strata/tempo/lib/modal';
import Banner from '@strata/tempo/lib/banner';
import Input from '@strata/tempo/lib/input';
import Toggle from '@strata/tempo/lib/toggle';
import Tree from '@strata/tempo/lib/tree';
import { IStatisticDriverData } from './data/IStatisticDriverData';
import { IStatisticDriverSaveData } from './data/IStatisticDriverSaveData';
import { IStatisticDriver } from './data/IStatisticDriver';
import { useEffect, useState } from 'react';
import { statisticDriverService } from './data/statisticDriverService';
import { IDataSourceLink } from './data/IDataSourceLink';
import { getNewGuid, getEmptyGuid } from '../shared/Utils';

const StatisticDrivers: React.FC = () => {
  const [statDriverData, setStatDriverData] = useState<IStatisticDriverData>();
  const [statDrivers, setStatDrivers] = useState<IStatisticDriver[]>([]);
  const [deletedDrivers, setDeletedDrivers] = useState<string[]>([]);
  const [updatedDrivers, setUpdatedDrivers] = useState<string[]>([]);
  const [runDriversModalVisible, setRunDriversModalVisible] = useState<boolean>(false);
  //
  const runPatientDriverTreeChildren = statDrivers.slice(0, 100).map((statDriver) => {
    return { key: statDriver.driverConfigGUID, title: statDriver.name };
  });
  const runPatientDriverTree = [
    {
      key: 'AllPatientKey',
      title: 'All Patient Drivers',
      children: runPatientDriverTreeChildren
    }
  ];

  //
  const handleCheck = () => {
    // console.log('onCheck', checkedKeys);
  };
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
    if (statDriverData) {
      setStatDrivers(statDriverData?.statisticDrivers);
    }

    Toast.show({
      message: 'Changes discarded'
    });
  };

  const handleAdd = () => {
    const newGuid = getNewGuid();

    const newDriver: IStatisticDriver = {
      driverConfigGUID: newGuid,
      dataTableGUID: getEmptyGuid(),
      measureGUID: getEmptyGuid(),
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

  const handleSave = async () => {
    if (validateStatisticDrivers()) {
      //clean up update lists
      let driversToUpdate = updatedDrivers;
      deletedDrivers.forEach(function (d) {
        if (updatedDrivers.indexOf(d) >= 0) {
          driversToUpdate = driversToUpdate.filter(function (u) {
            return u !== d;
          });
        }
      });
      //get stats to update
      const statDriversToUpdate = statDrivers.filter(function (stat) {
        return driversToUpdate.indexOf(stat.driverConfigGUID) >= 0 && stat.isNew === false;
      });
      //get stats to add
      const statDriversToAdd = statDrivers.filter(function (stat) {
        return driversToUpdate.indexOf(stat.driverConfigGUID) >= 0 && stat.isNew === true;
      });

      const statDriverSaveData: IStatisticDriverSaveData = {
        addedStatDrivers: statDriversToAdd,
        updatedStatDrivers: statDriversToUpdate,
        deletedStatDrivers: deletedDrivers
      };
      console.log(statDriverSaveData);
      let success = true;
      try {
        await statisticDriverService.saveStatisticDrivers(statDriverSaveData);
      } catch (error) {
        success = false;
      }

      if (success) {
        //reset Update Lists
        setUpdatedDrivers([]);
        setDeletedDrivers([]);
        Toast.show({
          toastType: 'success',
          message: 'Changes saved'
        });
      } else {
        Toast.show({
          toastType: 'error',
          message: 'Changed not saved'
        });
      }
      //refresh grid
      //call back from save should return new
    }
  };

  const validateStatisticDrivers = () => {
    const data = statDrivers;
    const dupeNames = [];
    let message = '';

    for (let i = 0; i < data.length; i++) {
      if (data[i].name === '') {
        message = 'Statistic driver name cannot be blank. Column: 0 , Row: ' + i + '.';
        break;
      }
      if (data[i].dataTableGUID === getEmptyGuid()) {
        message = 'Data Source cannot be empty. Column: 1 , Row: ' + i + '.';
        break;
      }
      if (data[i].measureGUID === getEmptyGuid()) {
        message = 'Measure cannot be empty. Column: 2 , Row: ' + i + '.';
        break;
      }
      if (dupeNames.indexOf(data[i].name) > -1) {
        message = 'Statistic driver name must be unique. Column: 0 , Row: ' + i + '.';
        break;
      } else {
        dupeNames.push(data[i].name);
      }
    }

    if (message !== '') {
      Modal.alert({
        title: 'Changes not saved',
        content: message,
        alertType: 'error'
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <Banner>Any changes to as statistic will affect every costing configuration that uses the statistic.</Banner>
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
            <Button icon='DoubleRight' onClick={() => setRunDriversModalVisible(true)}>
              Run Patient Drivers
            </Button>
          </>
        }
      />
      <DataGrid
        key='StatDriverGrid'
        value={statDrivers}
        onCellEdit={(e) => {
          //add to updated drivers
          if (updatedDrivers.indexOf(e.rowData.driverConfigGUID) < 0) {
            const driversToUpdate = [e.rowData.driverConfigGUID].concat(updatedDrivers);
            setUpdatedDrivers(driversToUpdate);
          }
        }}
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
        <DataGrid.Column
          key='name'
          header='Name'
          filter
          editable
          field='name'
          width={200}
          validationRules={[
            {
              required: true
            },
            {
              type: 'string'
            },
            {
              validator: (rule, value, callback, source, options) => {
                // options.cellArgs as ICellEditorArgs contain additional info
                // rule.message allows you to customize the validation message dynamically
                return value !== '';
              },
              message: 'Enter a name'
            }
          ]}
        />
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
                      //need to refresh grid data
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
                        //need to refresh grid data
                        setStatDrivers(updatedDrivers);
                      }
                    }
                  }
                  //add to updated drivers
                  if (updatedDrivers.indexOf(cellEditorArgs.rowData.driverConfigGUID) < 0) {
                    const driversToUpdate = [cellEditorArgs.rowData.driverConfigGUID].concat(updatedDrivers);
                    setUpdatedDrivers(driversToUpdate);
                  }
                }}
                width={300}
                itemValueField='dataTableGUID'
                itemTextField='friendlyName'
                items={statDriverData?.dataSources}
              />
            </>
          )}
          validationRules={[
            {
              required: true
            },
            {
              type: 'string'
            },
            {
              validator: (rule, value, callback, source, options) => {
                // options.cellArgs as ICellEditorArgs contain additional info
                // rule.message allows you to customize the validation message dynamically
                return value !== '';
              },
              message: 'Enter a data source'
            }
          ]}
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
                  //add to updated drivers
                  if (updatedDrivers.indexOf(cellEditorArgs.rowData.driverConfigGUID) < 0) {
                    const driversToUpdate = [cellEditorArgs.rowData.driverConfigGUID].concat(updatedDrivers);
                    setUpdatedDrivers(driversToUpdate);
                  }
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
          width={150}
          body={(rowData) => (
            <>
              <Tooltip
                title={() => {
                  return rowData.isNew ? 'Add Rules' : 'EditRules';
                }}
              >
                <Button type='link' onClick={() => handleEditRules(rowData.driverConfigGUID)} disabled={rowData.isNew}>
                  {rowData.isNew ? 'Add Rules' : 'EditRules'}
                </Button>
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
                          const canDeleteDriver = statisticDriverService.validateRemoveDriver(rowData.driverConfigGUID);
                          if (canDeleteDriver) {
                            //add to deleted drivers
                            const driversToDelete = [rowData.driverConfigGUID].concat(deletedDrivers);
                            setDeletedDrivers(driversToDelete);
                            //refresh the grid
                            const newStatDrivers = statDrivers.filter(function (obj) {
                              return obj.driverConfigGUID !== rowData.driverConfigGUID;
                            });
                            setStatDrivers(newStatDrivers);
                          } else {
                            Modal.alert({
                              title: 'Statistic Drivers',
                              content: rowData.name + ' is in use by one or more costing configurations. Unable to delete this statistic.',
                              alertType: 'error'
                            });
                          }
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
      <Modal
        title='Run Patient Drivers'
        visible={runDriversModalVisible}
        onCancel={() => setRunDriversModalVisible(false)}
        onOk={() => setRunDriversModalVisible(false)}
        okText='Run Driver'
        removeBodyPadding
      >
        <Spacing padding={16} itemSpacing={12}>
          <Input search />
          <Toggle
            defaultValue={'all'}
            items={[
              { value: 'all', name: 'All' },
              { value: 'selected', name: 'Selected' }
            ]}
          />
        </Spacing>
        <Tree treeData={runPatientDriverTree} selectionMode='multiple' height={400} defaultCheckedKeys={[]} defaultExpandedKeys={['AllPatientKey']} onCheck={handleCheck} />
      </Modal>
    </>
  );
};

export default StatisticDrivers;
