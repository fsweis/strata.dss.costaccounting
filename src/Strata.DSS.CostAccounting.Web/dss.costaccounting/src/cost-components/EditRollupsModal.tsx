import React from 'react';
import Spacing from '@strata/tempo/lib/spacing';
import Modal from '@strata/tempo/lib/modal';
import Button from '@strata/tempo/lib/button';
import { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import DataGrid from '@strata/tempo/lib/datagrid';
import Tooltip from '@strata/tempo/lib/tooltip';
import { getEmptyGuid } from '../shared/Utils';
import Toast from '@strata/tempo/lib/toast';
import { ICostComponentRollup, newCostComponentRollup } from './data/ICostComponentRollup';

export interface IEditRollupsModalProps {
  rollups: ICostComponentRollup[];
  visible: boolean;
  onCancel: () => void;
  onOk: (updatedRollups: ICostComponentRollup[], deletedRollupsGuids: string[]) => void;
}

const EditRollupsModal: React.FC<IEditRollupsModalProps> = (props: IEditRollupsModalProps) => {
  const gridRef = React.useRef<DataGrid>(null);
  const [updatedRollups, setUpdatedRollups] = useState<ICostComponentRollup[]>([]);
  const [deletedRollupsGuids, setDeletedRollupsGuids] = useState<string[]>([]);
  const [gridRollups, setGridRollups] = useState<ICostComponentRollup[]>([]);
  const emptyGuid = getEmptyGuid();

  useEffect(() => {
    setGridRollups(cloneDeep(props.rollups));
    setUpdatedRollups([]);
    setDeletedRollupsGuids([]);
  }, [props.rollups]);

  const handleCancel = () => {
    if (updatedRollups.length > 0 || deletedRollupsGuids.length > 0 || gridRollups.some((d) => d.costComponentRollupGuid === emptyGuid)) {
      Modal.confirm({
        title: 'Discard unsaved changes?',
        okText: 'Discard Changes',
        cancelText: 'Keep Changes',
        onOk() {
          if (gridRollups) {
            setUpdatedRollups([]);
            setDeletedRollupsGuids([]);
            const newGridRollups = cloneDeep(props.rollups);
            setGridRollups(newGridRollups);
            props.onCancel();
          }
          Toast.show({
            message: 'Changes discarded'
          });
        }
      });
    } else {
      props.onCancel();
    }
  };

  const handleOk = async () => {
    if (updatedRollups.length > 0 || deletedRollupsGuids.length > 0 || gridRollups.some((d) => d.costComponentRollupGuid === emptyGuid)) {
      if (await validateRollups()) {
        const rollupsNotDeleted = updatedRollups.filter((rollup) => !deletedRollupsGuids.includes(rollup.costComponentRollupGuid));
        const rollupsToUpdate = gridRollups.filter((d) => rollupsNotDeleted.includes(d) || d.costComponentRollupGuid === emptyGuid);
        props.onOk(rollupsToUpdate, deletedRollupsGuids);
      }
    } else {
      props.onCancel();
    }
  };

  const validateRollups = async () => {
    if (!gridRef.current) {
      return false;
    }
    const invalidCells = await gridRef.current.validateGrid();
    if (invalidCells.length > 0) {
      const invalidKeys = invalidCells.map((cell) => cell.rowKey);
      const invalidRows: { rowNumber: number; guid: string }[] = gridRollups
        .map((rollup, index) => {
          return { guid: rollup.displayId, rowNumber: index };
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

  const handleAddRollup = () => {
    const rollup = newCostComponentRollup();
    if (gridRollups != null) {
      const updatedRollups = [rollup].concat(gridRollups);
      setGridRollups(updatedRollups);
      setUpdatedRollups(updatedRollups);
    }
  };

  const handleDeleteRow = (rollup: ICostComponentRollup) => {
    if (gridRollups == null) {
      return;
    }
    if (rollup.costComponentRollupGuid === '') {
      const costComponents = updatedRollups.filter((cc) => cc.displayId !== rollup.displayId);
      setUpdatedRollups(costComponents);
    } else {
      const rollupsToDelete = [rollup.costComponentRollupGuid].concat(deletedRollupsGuids);
      setDeletedRollupsGuids(rollupsToDelete);
    }
    //refresh the grid
    const rollups = gridRollups.filter((obj) => obj !== rollup);
    setGridRollups(rollups);
  };

  const handleCellEdit = (rollup: ICostComponentRollup) => {
    //add to updated cost components
    if (!updatedRollups.includes(rollup)) {
      const rollupsToUpdate = [rollup].concat(updatedRollups);
      setUpdatedRollups(rollupsToUpdate);
    }
  };
  return (
    <>
      <Modal title='Edit Rollups' visible={props.visible} onCancel={handleCancel} width='large' onOk={handleOk} okText='Done' removeBodyPadding>
        <Spacing padding={16} itemSpacing={12}>
          <Button icon='Plus' onClick={handleAddRollup}>
            Add Rollup
          </Button>
        </Spacing>
        <DataGrid
          key='rollupsGrid'
          pager={{
            pageSize: 10
          }}
          dataKey='displayId'
          ref={gridRef}
          value={gridRollups}
          onCellEdit={(e) => handleCellEdit(e.rowData)}
        >
          <DataGrid.Column
            header='Name'
            field='name'
            width={280}
            editable
            align='left'
            isCellClickable={() => false}
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
                  const rollup: ICostComponentRollup = (options as any).cellArgs.rowData;
                  const dupe = gridRollups.findIndex((d) => d.name.toLowerCase() === stringVal && d.displayId !== rollup.displayId) !== -1;
                  return !dupe;
                },
                message: 'Enter a unique name'
              }
            ]}
          />
          <DataGrid.CheckboxColumn field='excluded' header='Excluded' editable width={152} />
          <DataGrid.EmptyColumn />
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
      </Modal>
    </>
  );
};

export default EditRollupsModal;
