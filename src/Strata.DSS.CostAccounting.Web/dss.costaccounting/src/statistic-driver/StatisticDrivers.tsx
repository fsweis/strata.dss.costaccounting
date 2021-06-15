import React, { useContext, useEffect, useState } from 'react';
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
import RouteConfirm from '@strata/tempo/lib/routeconfirm';
import Text from '@strata/tempo/lib/text';
import { usePageLoader } from '@strata/tempo/lib/pageloader';
import { ICellEditorArgs } from '@strata/tempo/lib/datacolumn';
import { IStatisticDriverSaveData } from './data/IStatisticDriverSaveData';
import { IStatisticDriver } from './data/IStatisticDriver';
import { statisticDriverService } from './data/statisticDriverService';
import { IDataSourceLink } from './data/IDataSourceLink';
import { getEmptyGuid } from '../shared/Utils';
import cloneDeep from 'lodash/cloneDeep';
import { IDataSource } from '../shared/data/IDataSource';
import PatientDriverTreeModal from './PatientDriverTreeModal';
import useStatDriverRulesEditWindow from './data/useStatDriverRulesEditWindow';
import { CostConfigContext } from '../shared/data/CostConfigContext';

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
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const emptyGuid = getEmptyGuid();
  const { costConfig } = useContext(CostConfigContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (costConfig && costConfig.type) {
          const [dataSources, dataSourceLinks, statisticDrivers] = await Promise.all([
            statisticDriverService.getDataSources(costConfig.type),
            statisticDriverService.getDataSourceLinks(costConfig.type),
            statisticDriverService.getStatisticDrivers(costConfig.type)
          ]);
          setDataSources(dataSources);
          setDataSourceLinks(dataSourceLinks);
          setStatDrivers(statisticDrivers);
          setTempStatDrivers(cloneDeep(statisticDrivers));
        }
      } finally {
        setGridLoading(false);
      }
    };
    setGridLoading(true);
    fetchData();
  }, [costConfig]);

  const handleCancel = () => {
    if (updatedDriverGuids.length > 0 || deletedDriverGuids.length > 0 || tempStatDrivers.some((d) => d.driverConfigGuid === emptyGuid)) {
      Modal.confirm({
        title: 'Discard unsaved changes?',
        content: 'Changes will be discarded.',
        okText: 'Discard Changes',
        cancelText: 'Keep Changes',
        onOk() {
          if (tempStatDrivers) {
            setUpdatedDriverGuids([]);
            setDeletedDriverGuids([]);
            const tempStats = cloneDeep(statDrivers);
            setTempStatDrivers(tempStats);
          }
          Toast.show({
            message: 'Changes discarded'
          });
        }
      });
    }
  };

  const handleAdd = () => {
    const newDriver: IStatisticDriver = {
      driverConfigGuid: emptyGuid,
      dataTableGuid: '',
      measureGuid: '',
      hasRules: false,
      isInverted: false,
      isUsed: false,
      name: '',
      costingType: costConfig?.type ?? 0
    };

    if (tempStatDrivers !== undefined) {
      const drivers = [newDriver].concat(tempStatDrivers);
      setTempStatDrivers(drivers);
    }
  };

  const openStatDriverRulesEditWindow = useStatDriverRulesEditWindow();

  const handleRulesClick = function (costingConfigGuid: string, driverConfigGuid: string) {
    openStatDriverRulesEditWindow(costingConfigGuid, driverConfigGuid);
  };

  const handleSave = async () => {
    if (await validateStatisticDrivers()) {
      const guids = updatedDriverGuids.filter((guid) => !deletedDriverGuids.includes(guid));
      const updatedStatDrivers = tempStatDrivers.filter((d) => guids.includes(d.driverConfigGuid) || d.driverConfigGuid === emptyGuid);

      const statDriverSaveData: IStatisticDriverSaveData = {
        updatedStatDrivers: updatedStatDrivers,
        deletedStatDrivers: deletedDriverGuids,
        costingType: costConfig?.type ?? 0
      };

      // Don't actually save if there are no changes
      if (!statDriverSaveData.updatedStatDrivers.length && !statDriverSaveData.deletedStatDrivers.length) {
        // TODO: Get exact language here
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
          content: 'Try again later. If the problem persists, contact your system administrator.',
          alertType: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const validateStatisticDrivers = async () => {
    if (!gridRef.current) {
      return false;
    }
    const invalidCells = await gridRef.current.validateGrid();
    if (invalidCells.length > 0) {
      const invalidKeys = invalidCells.map((cell) => cell.rowKey);
      const invalidRows: { rowNumber: number; guid: string }[] = tempStatDrivers
        .map((driver, index) => {
          return { guid: driver.driverConfigGuid, rowNumber: index };
        })
        .filter((r) => invalidKeys.includes(r.guid));

      const rowNumbers = invalidRows.map((r) => r.rowNumber + 1);
      Modal.alert({
        title: 'Changes not saved',
        content: `Fix errors in rows: ${rowNumbers.join(', ')}`,
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

  const handleDelete = (driverConfigGuid: string, isNew: boolean) => {
    if (tempStatDrivers !== undefined) {
      if (isNew) {
        const newUpdatedDriverGuids = updatedDriverGuids.filter((guid) => guid !== driverConfigGuid);
        setUpdatedDriverGuids(newUpdatedDriverGuids);
      } else {
        //add to deleted drivers
        const driversToDelete = [driverConfigGuid].concat(deletedDriverGuids);
        setDeletedDriverGuids(driversToDelete);
      }
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
        dataKey='driverConfigGuid'
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
        loading={gridLoading}
      >
        <DataGrid.RowNumber></DataGrid.RowNumber>
        <DataGrid.Column
          header='Name'
          filter
          editable
          field='name'
          width={240}
          validationRules={[
            {
              required: true,
              type: 'string',
              whitespace: true
            },
            {
              validator: (rule, value, callback, source, options) => {
                const stringVal: string = value.toString().trim().toLowerCase();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const driver: IStatisticDriver = (options as any).cellArgs.rowData;
                const dupe = tempStatDrivers.findIndex((d) => d.name.toLowerCase() === stringVal && d.driverConfigGuid !== driver.driverConfigGuid) !== -1;
                return !dupe;
              },
              message: 'Enter a unique name'
            }
          ]}
        />
        <DataGrid.DropDownColumn
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
              {cellEditorArgs.rowData.isUsed && <Text>{dataSources.find((x) => x.dataTableGuid === cellEditorArgs.rowData.dataTableGuid)?.friendlyName}</Text>}
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
          validationRules={[
            {
              required: true,
              type: 'string'
            }
          ]}
        />
        <DataGrid.DropDownColumn
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
          validationRules={[
            {
              required: true,
              type: 'string'
            }
          ]}
        />
        <DataGrid.CheckboxColumn header='Inverted' editable field='isInverted' sortable width={80} />
        <DataGrid.EmptyColumn />
        <DataGrid.Column
          align='right'
          width={144}
          body={(rowData) => (
            <>
              <Spacing vAlign='center'>
                <Tooltip title={rowData.driverConfigGuid === emptyGuid ? 'Save driver to add rules' : ''}>
                  <Button
                    type='link'
                    /*hard coding configGuid until we can pull from route/Url*/
                    onClick={() => handleRulesClick(costConfig?.costingConfigGuid ?? '', rowData.driverConfigGuid)}
                    disabled={rowData.driverConfigGuid === emptyGuid}
                  >
                    {rowData.hasRules ? 'Edit Rules' : 'Add Rules'}
                  </Button>
                </Tooltip>
                <Tooltip placement='left' title={rowData.isUsed ? "Can't delete drivers in use" : 'Delete'}>
                  <Button type='link' icon='Delete' disabled={rowData.isUsed} onClick={() => handleDelete(rowData.driverConfigGuid, rowData.driverConfigGuid === emptyGuid)} />
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
      <RouteConfirm
        showPrompt={updatedDriverGuids.length > 0 || deletedDriverGuids.length > 0 || tempStatDrivers.some((d) => d.driverConfigGuid === emptyGuid)}
        title={'Discard unsaved changes?'}
        okText={'Discard Changes'}
        cancelText={'Keep Changes'}
      />
    </>
  );
};

export default StatisticDrivers;
