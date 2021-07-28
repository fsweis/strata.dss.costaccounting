import React from 'react';
import Spacing from '@strata/tempo/lib/spacing';
import Modal from '@strata/tempo/lib/modal';
import Input from '@strata/tempo/lib/input';
import Button from '@strata/tempo/lib/button';
import { useEffect, useState, ChangeEvent } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import DataGrid from '@strata/tempo/lib/datagrid';
import Tooltip from '@strata/tempo/lib/tooltip';
import { ICostComponentRollup, newCostComponentRollup } from './data/ICostComponentRollup';

export interface IEditRollupsModalProps {
  rollups: ICostComponentRollup[];
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const EditRollupsModal: React.FC<IEditRollupsModalProps> = (props: IEditRollupsModalProps) => {
  const [loading, setLoading] = React.useState(false);
  const gridRef = React.useRef<DataGrid>(null);
  const [updatedRollups, setUpdatedRollups] = useState<ICostComponentRollup[]>([]); //Used for create updates. Without creating new guid in frontend need a way to handle deleting and updating new entries.
  const [deletedRollupsGuids, setDeletedRollupsGuids] = useState<string[]>([]); //Used for delete to server
  const [gridRollups, setGridRollups] = useState<ICostComponentRollup[]>([]); //Used for UI

  useEffect(() => {
    console.log(props.rollups);
    setGridRollups(cloneDeep(props.rollups));
  }, [props.rollups]);

  const handleCancel = () => {
    props.onCancel();
  };

  const handleOk = () => {
    props.onOk();
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
    if (rollup.costComponentRollupGUID === '') {
      const costComponents = updatedRollups.filter((cc) => cc.displayId !== rollup.displayId);
      setUpdatedRollups(costComponents);
    } else {
      const rollupsToDelete = [rollup.costComponentRollupGUID].concat(deletedRollupsGuids);
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
          loading={loading}
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
