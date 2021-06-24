import Button from '@strata/tempo/lib/button';
import Modal from '@strata/tempo/lib/modal';
import Spacing from '@strata/tempo/lib/spacing';
import Tooltip from '@strata/tempo/lib/tooltip';
import React, { useEffect, useState } from 'react';
import { ICostConfig } from '../shared/data/ICostConfig';
import { CostingType } from '../shared/enums/CostingTypeEnum';
import Input from '@strata/tempo/lib/input';
import { costConfigService } from '../shared/data/costConfigService';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid, { IGlobalFilterValue } from '@strata/tempo/lib/datagrid/DataGrid';
import ConfigureCostingConfigModal from './ConfigureCostingConfigModal';
import Toast from '@strata/tempo/lib/toast';

export interface ICostingConfigsModalProps {
  visible: boolean;
  onCancel: () => void;
  onChangeConfigs: (costingConfigGuid: string) => void;
}

const CostingConfigsModal: React.FC<ICostingConfigsModalProps> = (props: ICostingConfigsModalProps) => {
  const [costingConfigModalVisible, setCostingConfigModalVisible] = React.useState<boolean>(false);
  const [costConfigs, setCostConfigs] = useState<ICostConfig[]>([]);
  const [copyCostConfigGuid, setCopyCostConfigGuid] = useState<string>('');
  const [globalFilterValue, setGlobalFilterValue] = useState<IGlobalFilterValue>({ fields: ['name', 'description'], value: '' });

  useEffect(() => {
    const fetchData = async () => {
      const costModels = await costConfigService.getCostConfigs();
      setCostConfigs(costModels);
    };

    fetchData();
  }, []);

  const handleCancel = () => {
    props.onCancel();
  };

  const handleAddConfig = (newConfig: ICostConfig) => {
    setCostingConfigModalVisible(false);
  };

  const handleChangeConfigs = (costingConfigGuid: string) => {
    props.onChangeConfigs(costingConfigGuid);
  };

  const handleCopy = (costingConfigGuid: string) => {
    setCopyCostConfigGuid(costingConfigGuid);
    setCostingConfigModalVisible(true);
  };

  const handleDelete = (costingConfigGuid: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this Costing Configuration?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        costConfigService.deleteCostConfig(costingConfigGuid);
        Toast.show({ message: 'A task to delete a costing configuration has been created.', toastType: 'info' });
      }
    });
  };

  const getCostingTypeName = (type: CostingType) => {
    return type === CostingType.Claims ? 'Claims' : 'Patient Care';
  };

  return (
    <>
      <Modal title='All Models' visible={props.visible} onCancel={handleCancel} footer={null} width='extraLarge'>
        <ActionBar
          filters={<Input search width={200} onChange={(e) => setGlobalFilterValue({ fields: ['name', 'description'], value: e.target.value })} />}
          actions={
            <>
              <Button
                icon='Plus'
                onClick={() => {
                  setCostingConfigModalVisible(true);
                }}
              >
                Add Model
              </Button>
            </>
          }
        />
        <DataGrid key='allModelsGrid' scrollable dataKey='costingConfigGuid' value={costConfigs} globalFilterValue={globalFilterValue}>
          <DataGrid.RowNumber />
          <DataGrid.Column
            header='Name'
            width={320}
            sortable
            body={(rowData) => (
              <>
                <Spacing vAlign='center'>
                  <Button type='link' onClick={() => handleChangeConfigs(rowData.costingConfigGuid)}>
                    {rowData.name}
                  </Button>
                </Spacing>
              </>
            )}
          ></DataGrid.Column>
          <DataGrid.Column header='Description' field='description' collapseLongText width={280} sortable />
          <DataGrid.Column header='Type' field='type' width={120} body={(rowData) => getCostingTypeName(rowData.type)} sortable />
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
      <ConfigureCostingConfigModal
        visible={costingConfigModalVisible}
        onCancel={() => {
          setCostingConfigModalVisible(false);
          setCopyCostConfigGuid('');
        }}
        onSave={handleAddConfig}
        copyCostConfigGuid={copyCostConfigGuid}
        costConfigs={costConfigs}
      ></ConfigureCostingConfigModal>
    </>
  );
};
export default CostingConfigsModal;
