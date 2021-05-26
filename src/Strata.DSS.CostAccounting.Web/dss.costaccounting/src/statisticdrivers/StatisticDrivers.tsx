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
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import Text from '@strata/tempo/lib/text';
import { usePageLoader } from '@strata/tempo/lib/pageloader';
import { IStatisticDriverSaveData } from './data/IStatisticDriverSaveData';
import { IStatisticDriver } from './data/IStatisticDriver';
import { useEffect, useState } from 'react';
import { statisticDriverService } from './data/statisticDriverService';
import { IDataSourceLink } from './data/IDataSourceLink';
import { getNewGuid } from '../shared/Utils';
import cloneDeep from 'lodash/cloneDeep';
import { IDataSource } from '../shared/data/IDataSource';
import PatientDriverTreeModal from './PatientDriverTreeModal';
import { ICellEditorArgs } from '@strata/tempo/lib/datacolumn';

const StatisticDrivers: React.FC = () => {
  const [statDrivers, setStatDrivers] = useState<IStatisticDriver[]>([]);
  const [tempStatDrivers, setTempStatDrivers] = useState<IStatisticDriver[]>([]);
  const [dataSources, setDataSources] = useState<IDataSource[]>([]);
  const [dataSourceLinks, setDataSourceLinks] = useState<IDataSourceLink[]>([]);

  const [patientDriverTreeModalVisible, setPatientDriverTreeModalVisible] = useState<boolean>(false);
  const [deletedDriverGuids, setDeletedDriverGuids] = useState<string[]>([]);
  const [updatedDriverGuids, setUpdatedDriverGuids] = useState<string[]>([]);

  const gridRef = React.useRef<DataGrid>(null);

  const { setLoading } = usePageLoader();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataSources, dataSourceLinks, statisticDrivers] = await Promise.all([
          statisticDriverService.getDataSources(),
          statisticDriverService.getDataSourceLinks(),
          statisticDriverService.getStatisticDrivers()
        ]);
        setDataSources(dataSources);
        setDataSourceLinks(dataSourceLinks);
        setStatDrivers(statisticDrivers);
        setTempStatDrivers(cloneDeep(statisticDrivers));
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [setLoading]);

  const handleCancel = () => {
    if (tempStatDrivers) {
      setUpdatedDriverGuids([]);
      setDeletedDriverGuids([]);
      const tempStats = cloneDeep(statDrivers);
      setTempStatDrivers(tempStats);
    }
    Toast.show({
      message: 'Changes discarded'
    });
  };

  const handleAdd = () => {
    const newGuid = getNewGuid();

    const newDriver: IStatisticDriver = {
      driverConfigGuid: newGuid,
      dataTableGuid: '',
      measureGuid: '',
      hasRules: false,
      isInverted: false,
      isNew: true,
      isUsed: false,
      name: '',
      costingType: 1 //this should be costing type from context
    };

    if (tempStatDrivers !== undefined) {
      const drivers = [newDriver].concat(tempStatDrivers);
      setTempStatDrivers(drivers);
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
      const guids = updatedDriverGuids.filter((guid) => !deletedDriverGuids.includes(guid));
      const updatedStatDrivers = tempStatDrivers.filter((d) => guids.includes(d.driverConfigGuid) && !d.isNew);
      const addedStatDrivers = tempStatDrivers.filter((d) => guids.includes(d.driverConfigGuid) && d.isNew);

      const statDriverSaveData: IStatisticDriverSaveData = {
        addedStatDrivers: addedStatDrivers,
        updatedStatDrivers: updatedStatDrivers,
        deletedStatDrivers: deletedDriverGuids
      };

      // Don't actually save if there are no changes
      if (!statDriverSaveData.addedStatDrivers.length && !statDriverSaveData.updatedStatDrivers.length && !statDriverSaveData.deletedStatDrivers.length) {
        // TODO: Stelios give us a toast message
        Toast.show({
          toastType: 'info',
          message: 'No changes to save'
        });
        return;
      }

      try {
        setLoading(true);
        //refresh stat drivers from return
        const statisticDrivers = await statisticDriverService.saveStatisticDrivers(statDriverSaveData);
        setStatDrivers(statisticDrivers);
        setTempStatDrivers(cloneDeep(statisticDrivers));
        setUpdatedDriverGuids([]);
        setDeletedDriverGuids([]);
        Toast.show({
          toastType: 'success',
          message: 'Changes saved'
        });
      } catch (error) {
        // TODO: Get exact language here
        Modal.alert({
          title: 'Changes not saved',
          content: 'Something went wrong when attempting to save changes',
          alertType: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const validateStatisticDrivers = () => {
    const data = tempStatDrivers;
    const dupeNames: string[] = [];
    let message = '';
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === '') {
        message += 'Statistic driver name cannot be blank. Row: ' + i + '. ';
      }
      if (data[i].dataTableGuid === '') {
        message += 'Data Source cannot be empty. Row: ' + i + '. ';
      }
      if (data[i].measureGuid === '') {
        message += 'Measure cannot be empty. Row: ' + i + '. ';
      }
      if (dupeNames.includes(data[i].name)) {
        message += 'Statistic driver name must be unique. Row: ' + i + '. ';
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
    const measureGuids = dataSourceLinks.filter((l) => l.friendlyName.toLowerCase().includes(filterValue)).map((l) => l.measureGuid);
    return measureGuids.includes(cellValue);
  };

  const updateDropDownDrivers = (driverConfigGuid: string, measureGuid: string) => {
    const updatedDrivers = tempStatDrivers.map((driver) => {
      if (driver.driverConfigGuid === driverConfigGuid) {
        return { ...driver, measureGuid: measureGuid };
      }
      return driver;
    });
    return updatedDrivers;
  };

  const handleDataSourceChange = (cellEditorArgs: ICellEditorArgs, value: string) => {
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
        //need to refresh grid data
        setTempStatDrivers(updatedDrivers);
      } else {
        const nonDefaultValue = dataSourceLinks.filter((x) => x.dataTableGuid === value);
        if (nonDefaultValue !== undefined && nonDefaultValue.length > 0) {
          const updatedDrivers = updateDropDownDrivers(cellEditorArgs.rowData.driverConfigGuid, nonDefaultValue[0].measureGuid);
          //need to refresh grid data
          setTempStatDrivers(updatedDrivers);
        }
      }
    }
    //add to updated drivers
    if (!updatedDriverGuids.includes(cellEditorArgs.rowData.driverConfigGuid)) {
      const driversToUpdate = [cellEditorArgs.rowData.driverConfigGuid].concat(updatedDriverGuids);
      setUpdatedDriverGuids(driversToUpdate);
    }
  };

  const handleDataSourceLinkChange = (cellEditorArgs: ICellEditorArgs, value: string) => {
    cellEditorArgs.rowData.measureGuid = value;
    //add to updated drivers
    if (!updatedDriverGuids.includes(cellEditorArgs.rowData.driverConfigGuid)) {
      const driversToUpdate = [cellEditorArgs.rowData.driverConfigGuid].concat(updatedDriverGuids);
      setUpdatedDriverGuids(driversToUpdate);
    }
  };

  const handleDelete = (driverConfigGuid: string) => {
    if (tempStatDrivers !== undefined) {
      //add to deleted drivers
      const driversToDelete = [driverConfigGuid].concat(deletedDriverGuids);
      setDeletedDriverGuids(driversToDelete);
      //refresh the grid
      const newStatDrivers = tempStatDrivers.filter((obj) => obj.driverConfigGuid !== driverConfigGuid);
      setTempStatDrivers(newStatDrivers);
    }
  };

  const handleCellEdit = (driverConfigGuid: string) => {
    //add to updated drivers
    if (!updatedDriverGuids.includes(driverConfigGuid)) {
      const driversToUpdate = [driverConfigGuid].concat(updatedDriverGuids);
      setUpdatedDriverGuids(driversToUpdate);
    }
  };

  return (
    <>
      <Banner>Any changes to a statistic will affect every costing configuration that uses the statistic.</Banner>
      <Header
        title='Statistic Drivers'
        extra={
          <>
            <ButtonMenu
              buttonText='Reports'
              type='tertiary'
              onClick={() => {
                return;
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
            <Button icon='DoubleRight' onClick={() => setPatientDriverTreeModalVisible(true)}>
              Run Patient Drivers
            </Button>
          </>
        }
      />
      <DataGrid
        key='StatDriverGrid'
        ref={gridRef}
        value={tempStatDrivers}
        scrollable
        validationMode='all-cells'
        onCellEdit={(e) => handleCellEdit(e.rowData.driverConfigGuid)}
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
        <DataGrid.Column key='name' header='Name' filter editable field='name' width={240} />
        <DataGrid.DropDownColumn
          key='dataSource'
          field='dataTableGuid'
          header='Data Source'
          filter
          filterMatchMode='custom'
          filterFunction={filterDataSource}
          isCellEditable={(cellEditorArgs) => !cellEditorArgs.rowData.isUsed}
          width={200}
          itemValueField='dataTableGuid'
          itemTextField='friendlyName'
          items={dataSources}
          editor={(cellEditorArgs) => (
            <>
              {cellEditorArgs.rowData.isUsed && (
                <Text>
                  {
                    dataSources.filter((x) => {
                      return x.dataTableGuid === cellEditorArgs.rowData.dataTableGuid;
                    })[0].friendlyName
                  }
                </Text>
              )}
              {!cellEditorArgs.rowData.isUsed && (
                <DropDown
                  onChange={(value) => handleDataSourceChange(cellEditorArgs, value.toString())}
                  width={300}
                  value={cellEditorArgs.rowData.dataTableGuid}
                  itemValueField='dataTableGuid'
                  itemTextField='friendlyName'
                  items={dataSources}
                />
              )}
            </>
          )}
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
                onChange={(value) => handleDataSourceLinkChange(cellEditorArgs, value.toString())}
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
                <Tooltip
                  title={() => {
                    return rowData.isNew ? 'Driver must be saved.' : 'Add Rules';
                  }}
                >
                  <Button type='link' onClick={() => handleEditRules(rowData.driverConfigGuid)} disabled={rowData.isNew}>
                    {rowData.hasRules ? 'Edit Rules' : 'Add Rules'}
                  </Button>
                </Tooltip>

                <Tooltip
                  title={() => {
                    return rowData.isUsed ? 'Driver used in configurations' : 'Delete';
                  }}
                >
                  <Button type='link' icon='Delete' disabled={rowData.isUsed} onClick={() => handleDelete(rowData.driverConfigGuid)} />
                </Tooltip>
              </Spacing>
            </>
          )}
        />
      </DataGrid>
      <PatientDriverTreeModal
        onCancel={() => setPatientDriverTreeModalVisible(false)}
        onOk={() => setPatientDriverTreeModalVisible(false)}
        statDrivers={statDrivers}
        visible={patientDriverTreeModalVisible}
      ></PatientDriverTreeModal>
    </>
  );
};

export default StatisticDrivers;
