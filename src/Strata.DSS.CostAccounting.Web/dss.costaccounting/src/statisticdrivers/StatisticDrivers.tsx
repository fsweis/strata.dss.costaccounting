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
import Tree, { ITreeNode, Key } from '@strata/tempo/lib/tree';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import { IStatisticDriverData } from './data/IStatisticDriverData';
import { IStatisticDriverSaveData } from './data/IStatisticDriverSaveData';
import { IStatisticDriver } from './data/IStatisticDriver';
import { useEffect, useState, ChangeEvent } from 'react';
import { statisticDriverService } from './data/statisticDriverService';
import { IDataSourceLink } from './data/IDataSourceLink';
import { getNewGuid, getEmptyGuid } from '../shared/Utils';
import cloneDeep from 'lodash/cloneDeep';
import { IDataSource } from './data/IDataSource';

const StatisticDrivers: React.FC = () => {
  const [statDrivers, setStatDrivers] = useState<IStatisticDriver[]>([]);
  const [dataSources, setDataSources] = useState<IDataSource[]>([]);
  const [dataSourceLinks, setDataSourceLinks] = useState<IDataSourceLink[]>([]);
  const [deletedDrivers, setDeletedDrivers] = useState<string[]>([]);
  const [updatedDrivers, setUpdatedDrivers] = useState<string[]>([]);
  const [runDriversModalVisible, setRunDriversModalVisible] = useState<boolean>(false);

  const [patientDriversToRun, setPatientDriversToRun] = useState<Key[]>([]);
  const [patientDriversSearch, setPatientDriversSearch] = useState('');
  const [patientDriverTreeData, setPatientDriverTreeData] = useState<ITreeNode[]>([]);
  const [patientDriverTree, setPatientDriverTree] = useState<ITreeNode[]>([]);

  useEffect(() => {
    // runs once when component mounts

    const fetchData = async () => {
      setDataSources(await statisticDriverService.getDataSources());
      setDataSourceLinks(await statisticDriverService.getDataSourceLinks());
      setStatDrivers(await statisticDriverService.getStatisticDrivers());
    };
    fetchData();
  }, []);

  useEffect(() => {
    const runPatientDriverTreeChildren = statDrivers.map((statDriver) => {
      return { key: statDriver.driverConfigGuid, title: statDriver.name };
    });

    const runPatientDriverTree = [
      {
        key: 'AllPatientKey',
        title: 'All Patient Drivers',
        children: runPatientDriverTreeChildren
      }
    ];
    setPatientDriverTree(runPatientDriverTree);
  }, [statDrivers]);

  //patient driver tree search
  useEffect(() => {
    const searchValue = (value: string | undefined) => {
      const s = patientDriversSearch.toLowerCase();
      return value?.toLowerCase().includes(s);
    };
    const filterData = (data: ITreeNode[]) => {
      const filteredData = cloneDeep(data);
      return filteredData.filter((f) => {
        f.children = f.children?.filter((c) => searchValue(c.title?.toString()));
        return searchValue(f.title?.toString()) || f.children?.find((c) => searchValue(c.title?.toString()));
      });
    };
    if (patientDriversSearch !== '') {
      setPatientDriverTreeData(filterData(patientDriverTree));
    } else {
      setPatientDriverTreeData(patientDriverTree);
    }
  }, [patientDriversSearch, patientDriverTree]);

  const handleCancel = () => {
    if (statDrivers) {
      setStatDrivers(statDrivers);
    }

    Toast.show({
      message: 'Changes discarded'
    });
  };

  const handleAdd = () => {
    const newGuid = getNewGuid();

    const newDriver: IStatisticDriver = {
      driverConfigGuid: newGuid,
      dataTableGuid: getEmptyGuid(),
      measureGuid: getEmptyGuid(),
      hasRules: false,
      isInverted: false,
      isNew: true,
      isUsed: false,
      name: '',
      costingType: 1 //this should be costing type from context
    };

    if (statDrivers !== undefined) {
      const drivers = [newDriver].concat(statDrivers);
      setStatDrivers(drivers);
    }
  };

  const handleEditRules = function (driverConfigGuid: string) {
    //TODO with rules engine bli
    /*
    const url = 'https://dev.sdt.local/StrataJazz202123/DSS/HealthPlan/Statistics/HealthPlanRulesEditWindow.aspx?hpAdminStatisticDriverGuid=' + driverConfigGuid;
    const winid = driverConfigGuid;
    const options = 'scrollbars=0,toolbar=0,location=0,statusbar=0,menubar=0, resizable=1,width=1000,height=700,left=50,top=50';
    const win = window.open(url, winid, options);
    win?.focus();
    return win;
    */
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
        return driversToUpdate.indexOf(stat.driverConfigGuid) >= 0 && stat.isNew === false;
      });
      //get stats to add
      const statDriversToAdd = statDrivers.filter(function (stat) {
        return driversToUpdate.indexOf(stat.driverConfigGuid) >= 0 && stat.isNew === true;
      });

      const statDriverSaveData: IStatisticDriverSaveData = {
        addedStatDrivers: statDriversToAdd,
        updatedStatDrivers: statDriversToUpdate,
        deletedStatDrivers: deletedDrivers
      };

      let success = true;
      try {
        setStatDrivers(await statisticDriverService.saveStatisticDrivers(statDriverSaveData));
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
          message: 'Changes not saved'
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
      if (data[i].dataTableGuid === getEmptyGuid()) {
        message = 'Data Source cannot be empty. Column: 1 , Row: ' + i + '.';
        break;
      }
      if (data[i].measureGuid === getEmptyGuid()) {
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

  const filterDataSource = (cellValue: string, filterValue: string) => {
    if (typeof filterValue === 'string' && filterValue.trim() !== '' && filterValue.trim() !== '-') {
      filterValue = filterValue.toLowerCase().trim();
    } else {
      return true;
    }
    if (cellValue === undefined || cellValue === null) {
      return false;
    }
    const target = dataSources.find((dataSource) => dataSource.friendlyName.toLowerCase().indexOf(filterValue) > -1);
    if (target !== undefined) {
      return target.dataTableGuid === cellValue;
    }
    return false;
  };
  const filterDataSourceLink = (cellValue: string, filterValue: string) => {
    if (typeof filterValue === 'string' && filterValue.trim() !== '' && filterValue.trim() !== '-') {
      filterValue = filterValue.toLowerCase().trim();
    } else {
      return true;
    }
    if (cellValue === undefined || cellValue === null) {
      return false;
    }
    const target = dataSourceLinks.find((measure) => measure.friendlyName.toLowerCase().indexOf(filterValue) > -1);
    if (target !== undefined) {
      return target.measureGuid === cellValue;
    }
    return false;
  };

  const updateDropDownDrivers = (driverConfigGuid: string, measureGuid: string) => {
    const updatedDrivers = statDrivers.map((driver) => {
      if (driver.driverConfigGuid === driverConfigGuid) {
        return { ...driver, measureGuid: measureGuid };
      }
      return driver;
    });
    return updatedDrivers;
  };
  return (
    <>
      <Banner>Any changes to as statistic will affect every costing configuration that uses the statistic.</Banner>
      <Header
        title='Statistic Drivers'
        extra={
          <>
            <ButtonMenu
              buttonText='Reports'
              onClick={() => {
                console.log('Get Reports');
              }}
            >
              <ButtonMenu.Item key='1'>Statistic Drivers Report</ButtonMenu.Item>
            </ButtonMenu>

            <Button type='tertiary' icon='InfoCircle' />
          </>
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
        scrollable
        validationMode='all-cells'
        onCellEdit={(e) => {
          //add to updated drivers
          if (updatedDrivers.indexOf(e.rowData.driverConfigGuid) < 0) {
            const driversToUpdate = [e.rowData.driverConfigGuid].concat(updatedDrivers);
            setUpdatedDrivers(driversToUpdate);
          }
        }}
        pager={{
          pageSize: 100,
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
          width={240}
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
          field='dataTableGuid'
          header='Data Source'
          filter
          filterMatchMode='custom'
          filterFunction={filterDataSource}
          editable
          width={200}
          itemValueField='dataTableGuid'
          itemTextField='friendlyName'
          items={dataSources}
          editor={(cellEditorArgs) => (
            <>
              <DropDown
                onChange={(value) => {
                  if (cellEditorArgs.rowData.hasRules) {
                    Modal.alert({
                      title: 'Statistic Drivers',
                      content: 'You cannot edit a Data Source with existing rule filters'
                    });
                    return;
                  }

                  if (value !== cellEditorArgs.rowData.dataTableGuid) {
                    cellEditorArgs.rowData.dataTableGuid = value;
                    const defaultValue = dataSourceLinks.filter((x) => x.dataTableGuid === value && x.isFirstSelect === true);
                    if (defaultValue !== undefined && defaultValue.length > 0) {
                      const updatedDrivers = updateDropDownDrivers(cellEditorArgs.rowData.driverConfigGuid, defaultValue[0].measureGuid);
                      /*
                      const updatedDrivers = statDrivers.map((driver) => {
                        if (driver.driverConfigGuid === cellEditorArgs.rowData.driverConfigGuid) {
                          return { ...driver, measureGuid: defaultValue[0].measureGuid };
                        }
                        return driver;
                      });
                      */
                      //need to refresh grid data
                      setStatDrivers(updatedDrivers);
                    } else {
                      const nonDefaultValue = dataSourceLinks.filter((x) => x.dataTableGuid === value);
                      if (nonDefaultValue !== undefined && nonDefaultValue.length > 0) {
                        const updatedDrivers = updateDropDownDrivers(cellEditorArgs.rowData.driverConfigGuid, nonDefaultValue[0].measureGuid);

                        /*
                        const updatedDrivers = statDrivers.map((driver) => {
                          if (driver.driverConfigGuid === cellEditorArgs.rowData.driverConfigGuid) {
                            return { ...driver, measureGuid: nonDefaultValue[0].measureGuid };
                          }
                          return driver;
                        });
                         */
                        //need to refresh grid data
                        setStatDrivers(updatedDrivers);
                      }
                    }
                  }
                  //add to updated drivers
                  if (updatedDrivers.indexOf(cellEditorArgs.rowData.driverConfigGuid) < 0) {
                    const driversToUpdate = [cellEditorArgs.rowData.driverConfigGuid].concat(updatedDrivers);
                    setUpdatedDrivers(driversToUpdate);
                  }
                }}
                width={300}
                value={cellEditorArgs.rowData.dataTableGuid}
                itemValueField='dataTableGuid'
                itemTextField='friendlyName'
                items={dataSources}
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
          field='measureGuid'
          header='Measure'
          filter
          filterMatchMode='custom'
          filterFunction={filterDataSourceLink}
          editable
          width={200}
          itemValueField='measureGuid'
          itemTextField='friendlyName'
          items={dataSourceLinks}
          editor={(cellEditorArgs) => (
            <>
              <DropDown
                onChange={(value) => {
                  cellEditorArgs.rowData.measureGuid = value;
                  //add to updated drivers
                  if (updatedDrivers.indexOf(cellEditorArgs.rowData.driverConfigGuid) < 0) {
                    const driversToUpdate = [cellEditorArgs.rowData.driverConfigGuid].concat(updatedDrivers);
                    setUpdatedDrivers(driversToUpdate);
                  }
                }}
                width={300}
                itemValueField='measureGuid'
                itemTextField='friendlyName'
                value={cellEditorArgs.rowData.measureGuid}
                items={dataSourceLinks.filter((x: IDataSourceLink) => {
                  return x.dataTableGuid === cellEditorArgs.rowData.dataTableGuid;
                })}
              />
            </>
          )}
        />
        <DataGrid.CheckboxColumn key='inverted' header='Inverted' editable field='isInverted' sortable width={80} />
        <DataGrid.EmptyColumn />
        <DataGrid.Column
          align='right'
          width={144}
          body={(rowData) => (
            <>
              <Spacing vAlign='center'>
                <Button type='link' onClick={() => handleEditRules(rowData.driverConfigGuid)} disabled={rowData.isNew}>
                  {rowData.hasRules ? 'Edit Rules' : 'Add Rules'}
                </Button>

                <Tooltip
                  title={() => {
                    return rowData.isUsed ? 'Driver in use.' : 'Delete';
                  }}
                >
                  <Button
                    type='link'
                    icon='Delete'
                    disabled={rowData.isUsed}
                    onClick={() =>
                      Modal.confirm({
                        title: 'Permanently delete ' + (rowData.name === '' ? 'driver' : rowData.name) + '?',
                        okText: 'Delete Driver',
                        cancelText: 'Keep Driver',
                        onOk() {
                          if (statDrivers !== undefined) {
                            //add to deleted drivers
                            const driversToDelete = [rowData.driverConfigGuid].concat(deletedDrivers);
                            setDeletedDrivers(driversToDelete);
                            //refresh the grid
                            const newStatDrivers = statDrivers.filter(function (obj) {
                              return obj.driverConfigGuid !== rowData.driverConfigGuid;
                            });
                            setStatDrivers(newStatDrivers);
                          }
                        }
                      })
                    }
                  />
                </Tooltip>
              </Spacing>
            </>
          )}
        />
      </DataGrid>
      <Modal
        title='Run Patient Drivers'
        visible={runDriversModalVisible}
        onCancel={() => setRunDriversModalVisible(false)}
        onOk={() => setRunDriversModalVisible(false)}
        okText='Run Drivers'
        removeBodyPadding
      >
        <Spacing padding={16} itemSpacing={12}>
          <Input search onChange={(event: ChangeEvent<HTMLInputElement>) => setPatientDriversSearch(event.target.value)} />
        </Spacing>
        <Tree
          treeData={patientDriverTreeData}
          selectionMode='multiple'
          height={400}
          defaultCheckedKeys={[]}
          defaultExpandedKeys={['AllPatientKey']}
          onCheck={(checkedKeys, info) => {
            const guids: string[] = checkedKeys.toString().split(',');
            setPatientDriversToRun(guids);
          }}
        />
      </Modal>
    </>
  );
};

export default StatisticDrivers;
