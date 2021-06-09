import Button from '@strata/tempo/lib/button';
import Modal from '@strata/tempo/lib/modal';
import Spacing from '@strata/tempo/lib/spacing';
import Tooltip from '@strata/tempo/lib/tooltip';
import React, { useEffect, useState } from 'react';
import { ICostConfig } from '../shared/data/ICostConfig';
import Input from '@strata/tempo/lib/input';
import { costConfigService } from '../shared/data/CostConfigService';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid, { IGlobalFilterValue } from '@strata/tempo/lib/datagrid/DataGrid';

export interface ICostModelsModalProps {
  costModels: ICostConfig[];
  visible: boolean;
  onCancel: () => void;
}

const CostModelsModal: React.FC<ICostModelsModalProps> = (props: ICostModelsModalProps) => {
  const [costModels, setCostModels] = useState<ICostConfig[]>([]);
  const gridRef = React.useRef<DataGrid>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState<IGlobalFilterValue>({ fields: ['name', 'description'], value: '' });

  useEffect(() => {
    const fetchData = async () => {
      const [costModels] = await Promise.all([costConfigService.getCostConfig()]);
      setCostModels(costModels);
    };

    fetchData();
  }, []);

  const handleCancel = () => {
    props.onCancel();
  };

  const handleCellClick = (driverConfigGuid: string) => {
    //Switch Configs
    //Use Coles logic
  };

  const handleCopy = (driverConfigGuidToCopy: string) => {
    console.log('handle copy');
    //use Feras's modal
  };

  const handleDelete = (driverConfigGuidToDelete: string) => {
    console.log('handle delete');
  };

  const getConfigType = (type: number) => {
    if (type === 1) {
      return 'Claims';
    } else {
      //0 for Patient Care
      return 'Patient Care';
    }
  };

  return (
    <>
      <Modal title='All Models' visible={props.visible} onCancel={handleCancel} footer={null} width='extraLarge'>
        <ActionBar filters={<Input search width={200} onChange={(e) => setGlobalFilterValue({ fields: ['name', 'description'], value: e.target.value })} />} />
        <DataGrid key='allModelsGrid' ref={gridRef} scrollable dataKey='costingConfigGuid' value={costModels} globalFilterValue={globalFilterValue}>
          <DataGrid.RowNumber />
          <DataGrid.Column
            header='Name'
            width={320}
            sortable
            body={(rowData) => (
              <>
                <Spacing vAlign='center'>
                  <Button type='link' onClick={() => handleCellClick(rowData.costingConfigGuid)}>
                    {rowData.name}
                  </Button>
                </Spacing>
              </>
            )}
          ></DataGrid.Column>
          <DataGrid.Column header='Description' field='description' collapseLongText width={280} sortable />
          <DataGrid.Column header='Type' field='type' width={120} body={(rowData) => getConfigType(rowData.type)} sortable />
          <DataGrid.Column header='Fiscal Year' field='fiscalYearID' width={104} sortable />
          <DataGrid.DateColumn header='Last Edit' field='modifiedAtUtc' sortable width={128} />
          <DataGrid.DateColumn header='Last Published' field='lastPublishedRun' sortable width={128} />
          <DataGrid.Column
            align='right'
            width={80}
            sortable
            body={(rowData) => (
              <>
                <Spacing vAlign='center'>
                  <Tooltip title='Copy'>
                    <Button type='link' icon='Copy' onClick={() => handleCopy(rowData.costingConfigGuid)}></Button>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <Button type='link' icon='Delete' disabled={!rowData.isEditable} onClick={() => handleDelete(rowData.costingConfigGuid)}></Button>
                  </Tooltip>
                </Spacing>
              </>
            )}
          ></DataGrid.Column>
        </DataGrid>
      </Modal>
    </>
  );
};

export default CostModelsModal;
