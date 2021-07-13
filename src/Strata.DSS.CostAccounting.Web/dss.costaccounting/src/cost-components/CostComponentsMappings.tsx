import React from 'react';
import ActionBar from '@strata/tempo/lib/actionbar';
import Button from '@strata/tempo/lib/button';
import { useEffect } from 'react';
import { useState } from 'react';
import { ICostComponent, newCostComponent } from './data/ICostComponent';
import { ICostComponentSaveData } from './data/ICostComponentSaveData';
import DataGrid from '@strata/tempo/lib/datagrid';
import DropDown from '@strata/tempo/lib/dropdown';
import Tooltip from '@strata/tempo/lib/tooltip';
import { cloneDeep } from 'lodash';
import Modal from '@strata/tempo/lib/modal';
import Toast from '@strata/tempo/lib/toast';
import { MappingFieldNameEnums, MappingFriendlyNameEnums } from './enums/CostComponentMappingEnums';
import Drawer from '@strata/tempo/lib/drawer';
import { ICostingConfig } from '../shared/data/ICostingConfig';
import RouteConfirm from '@strata/tempo/lib/routeconfirm';
import { getEmptyGuid } from '../shared/Utils';
import { costComponentService } from './data/costComponentService';

export interface ICostComponentsMappingsProps {
  costingConfig: ICostingConfig | undefined;
}

const CostComponentsMappings: React.FC<ICostComponentsMappingsProps> = (props: ICostComponentsMappingsProps) => {
  const [loading, setLoading] = React.useState(false);
  const gridRef = React.useRef<DataGrid>(null);
  const [costComponents, setCostComponents] = useState<ICostComponent[]>([]); //Used for initial load and reset(cancel)
  const [gridCostComponents, setGridCostComponents] = useState<ICostComponent[]>([]); //Used for UI
  const [updatedCostComponents, setUpdatedCostComponents] = useState<ICostComponent[]>([]); //Used for create updates. Without creating new guid in frontend need a way to handle deleting and updating new entries.
  const [deletedCostComponentsGuids, setDeletedCostComponentsGuids] = useState<string[]>([]); //Used for delete to server

  const [drawerVisible, setDrawerVisible] = React.useState<boolean>(false);
  const [drawerTitle, setDrawerTitle] = React.useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const costComponents = await costComponentService.getCostComponentMappings();

        setCostComponents(costComponents);
        setGridCostComponents(cloneDeep(costComponents));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading, props.costingConfig]);

  const handleSave = async () => {
    if (await validateCostComponent()) {
      const guids = updatedCostComponents
        .filter((cc) => !deletedCostComponentsGuids.includes(cc.costComponentGuid))
        .map((cc) => {
          return cc.costComponentGuid;
        });

      const costComponents = gridCostComponents.filter((cc) => guids.includes(cc.costComponentGuid) || cc.costComponentGuid === '');

      const costComponentSaveData: ICostComponentSaveData = {
        updatedCostComponents: costComponents,
        deletedCostComponentsGuids: deletedCostComponentsGuids
      };

      if (!costComponentSaveData.updatedCostComponents.length && !costComponentSaveData.deletedCostComponentsGuids.length) {
        Toast.show({
          toastType: 'info',
          message: 'No changes to save'
        });
        return;
      }

      try {
        setLoading(true);

        //TODO: Implment
        // const costComponents: ICostComponent[] = []; //await costComponentService.saveCostComponents(costComponentSaveData);
        // setCostComponents(costComponents);
        // setGridCostComponents(cloneDeep(costComponents));
        // setUpdatedCostComponents([]);
        // setDeletedCostComponentsGuids([]);
      } catch (error) {
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

  const validateCostComponent = async () => {
    if (!gridRef.current) {
      return false;
    }

    const invalidCells = await gridRef.current.validateGrid();
    if (invalidCells.length > 0) {
      const invalidKeys = invalidCells.map((cell) => cell.rowKey);
      const invalidRows: { rowNumber: number; guid: string }[] = gridCostComponents
        .map((costComponent, index) => {
          return { guid: costComponent.costComponentGuid, rowNumber: index };
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

  const handleCancel = () => {
    if (updatedCostComponents.length > 0 || deletedCostComponentsGuids.length > 0) {
      Modal.confirm({
        title: 'Discard unsaved changes?',
        okText: 'Discard Changes',
        cancelText: 'Keep Changes',
        onOk() {
          if (gridCostComponents) {
            setUpdatedCostComponents([]);
            setDeletedCostComponentsGuids([]);
            const tempStats = cloneDeep(costComponents);
            setGridCostComponents(tempStats);
          }
          Toast.show({
            message: 'Changes discarded'
          });
        }
      });
    }
  };

  const handleAddCostComponent = () => {
    const costComponent = newCostComponent();

    if (gridCostComponents !== undefined) {
      const updatedCostComponents = [costComponent].concat(gridCostComponents);
      setGridCostComponents(updatedCostComponents);
      setUpdatedCostComponents(updatedCostComponents);
    }
  };

  const handleEditRollups = () => {
    //TODO: implement this with modal. Future BLI
    console.log('edit rollups');
  };

  const handleDeleteRow = (costComponent: ICostComponent) => {
    if (gridCostComponents !== undefined) {
      if (costComponent.costComponentGuid === '') {
        const costComponents = updatedCostComponents.filter((cc) => cc !== costComponent);
        setUpdatedCostComponents(costComponents);
      } else {
        const costComponentsToDelete = [costComponent.costComponentGuid].concat(deletedCostComponentsGuids);
        setDeletedCostComponentsGuids(costComponentsToDelete);
      }

      //refresh the grid
      const costComponents = gridCostComponents.filter((obj) => obj !== costComponent);
      setGridCostComponents(costComponents);
    }
  };

  const renderMultipleSelection = (accounts: string[]) => {
    if (accounts.length === 0) return;
    if (accounts.length > 1) {
      return accounts.length + ' selected';
    } else {
      return accounts[0];
    }
  };

  const handleCellClick = (cellArgs: any) => {
    let title = '';
    if (cellArgs.field === MappingFieldNameEnums.Accounts) {
      title = MappingFriendlyNameEnums.Accounts;
    } else if (cellArgs.field === MappingFriendlyNameEnums.JobCodes) {
      title = MappingFriendlyNameEnums.JobCodes;
    } else if (cellArgs.field === MappingFieldNameEnums.PayCodes) {
      title = MappingFriendlyNameEnums.PayCodes;
    } else {
      return;
    }

    //TODO: depending on what platform builds out update this
    setDrawerTitle(title);
    setDrawerVisible(true);
  };

  const handleDrawerCancel = () => {
    setDrawerVisible(false);
  };

  const handleDrawerSelect = () => {
    console.log('boom drawer select happened.');
    //TODO: wait for platform to determine how logic will operate here.
  };

  const handleCellEdit = (costComponent: ICostComponent) => {
    //add to updated cost components
    if (!updatedCostComponents.includes(costComponent)) {
      const costComponentToUpdate = [costComponent].concat(updatedCostComponents);
      setUpdatedCostComponents(costComponentToUpdate);
    }
  };

  return (
    <>
      <ActionBar
        actions={
          <>
            <Button icon='Plus' onClick={handleAddCostComponent}>
              Add Cost Component
            </Button>
            <Button icon='Edit' onClick={handleEditRollups}>
              Edit Rollups
            </Button>
          </>
        }
      />
      <DataGrid
        key='costComponentMappingsGrid'
        loading={loading}
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
        dataKey='costComponentGuid'
        ref={gridRef}
        value={gridCostComponents}
        onCellClick={handleCellClick}
        onCellEdit={(e) => handleCellEdit(e.rowData)}
      >
        <DataGrid.RowNumber />
        <DataGrid.Column header='Name' field='name' filter width={280} editable sortable align='left' isCellClickable={() => false} />
        <DataGrid.Column header='Accounts' field='accounts' filter width={200} sortable isCellClickable={() => true} customCellValue={(cellArgs) => renderMultipleSelection(cellArgs.row.accounts)} />
        <DataGrid.Column header='Job Code' field='jobCodes' filter width={200} isCellClickable={() => true} customCellValue={(cellArgs) => renderMultipleSelection(cellArgs.row.jobCodes)} />
        <DataGrid.Column header='Pay Code' field='payCodes' filter width={200} isCellClickable={() => true} customCellValue={(cellArgs) => renderMultipleSelection(cellArgs.row.payCodes)} />
        <DataGrid.Column
          header='Rollup'
          filter
          width={200}
          isCellClickable={() => false}
          body={(rowData) => (
            <>
              <DropDown
                width={200}
                items={[
                  { text: 'Option A', value: 1 },
                  { text: 'Option B', value: 2 },
                  { text: 'Option C', value: 3 },
                  { text: 'Option D', value: 4 }
                ]}
                value={rowData.rollup}
              />
            </>
          )}
        />
        <DataGrid.CheckboxColumn field='usingCompensation' header='Using Compensation' editable width={152} />
        <DataGrid.Column
          align='right'
          width={80}
          body={(rowData) => (
            <>
              <Tooltip title='Delete'>
                <Button type='link' icon='Delete' onClick={() => handleDeleteRow(rowData)} />
              </Tooltip>
            </>
          )}
        />
      </DataGrid>

      <Drawer
        title={drawerTitle}
        visible={drawerVisible}
        width={400}
        onClose={() => handleDrawerCancel()}
        footer={
          <>
            <Button onClick={handleDrawerCancel}>Cancel</Button>
            <Button type='primary' onClick={handleDrawerSelect}>
              Select
            </Button>
          </>
        }
      >
        stuff goes in here. Wait for Platform team to build it out.
      </Drawer>
      <RouteConfirm
        showPrompt={updatedCostComponents.length > 0 || deletedCostComponentsGuids.length > 0 || gridCostComponents.some((d) => d.costComponentGuid === getEmptyGuid())}
        title={'Discard unsaved changes?'}
        okText={'Discard Changes'}
        cancelText={'Keep Changes'}
      />
    </>
  );
};

export default CostComponentsMappings;
