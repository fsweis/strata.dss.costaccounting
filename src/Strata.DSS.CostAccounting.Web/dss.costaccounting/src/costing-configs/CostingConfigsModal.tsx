import Button from '@strata/tempo/lib/button';
import Modal from '@strata/tempo/lib/modal';
import Tooltip from '@strata/tempo/lib/tooltip';
import React, { useEffect, useState } from 'react';
import { ICostingConfig, newCostConfig } from '../shared/data/ICostingConfig';
import { CostingType } from '../shared/enums/CostingTypeEnum';
import Input from '@strata/tempo/lib/input';
import { costingConfigService } from '../shared/data/costingConfigService';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid, { IGlobalFilterValue } from '@strata/tempo/lib/datagrid/DataGrid';
import CostingConfigConfigureModal from './CostingConfigConfigureModal';
import Toast from '@strata/tempo/lib/toast';
import { PatientCare_FriendlyName, Claims_FriendlyName } from './constants/CostingTypeConstants';

export interface ICostingConfigsModalProps {
  visible: boolean;
  onCancel: () => void;
  onChangeConfigs: (costingConfigGuid: string) => void;
  onDeleteConfig: (costingConfigGuid: string) => void;
}

const CostingConfigsModal: React.FC<ICostingConfigsModalProps> = (props: ICostingConfigsModalProps) => {
  const [costingConfigs, setCostingConfigs] = useState<ICostingConfig[]>([]);
  const [costingConfigConfigureModalVisible, setCostingConfigConfigureModalVisible] = React.useState<boolean>(false);
  const [costingConfigForConfigure, setCostingConfigForConfigure] = useState<ICostingConfig>(newCostConfig);
  const [costingConfigConfigureIsCopy, setCostingConfigConfigureIsCopy] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<IGlobalFilterValue>({ fields: ['name', 'description'], value: '' });

  useEffect(() => {
    const fetchData = async () => {
      setCostingConfigs(await costingConfigService.getCostingConfigs());
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    setGlobalFilterValue({ fields: ['name', 'description'], value: '' });
    props.onCancel();
  };

  const handleChangeConfig = (costingConfigGuid: string) => {
    setGlobalFilterValue({ fields: ['name', 'description'], value: '' });
    props.onChangeConfigs(costingConfigGuid);
  };

  const handleAddConfig = (newConfig: ICostingConfig) => {
    setCostingConfigConfigureModalVisible(false);
    const updatedCostConfigs = [...costingConfigs, newConfig];
    setCostingConfigs(updatedCostConfigs);
  };

  const handleDelete = (costingConfigGuid: string) => {
    const createDeleteCostingConfigTask = async (costingConfigGuid: string) => {
      await costingConfigService.createDeleteCostingConfigTask(costingConfigGuid);
      Toast.show({ message: 'A task to delete a costing configuration has been created.', toastType: 'info' });
      const updatedCostConfigs = costingConfigs.filter((x) => x.costingConfigGuid !== costingConfigGuid);
      setCostingConfigs(updatedCostConfigs);
      props.onDeleteConfig(costingConfigGuid);
    };

    Modal.confirm({
      title: 'Are you sure you want to delete this Costing Configuration?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        createDeleteCostingConfigTask(costingConfigGuid);
      }
    });
  };

  const openCostingConfigConfigureModal = (costingConfig: ICostingConfig, isCopy: boolean) => {
    setCostingConfigForConfigure(costingConfig);
    setCostingConfigConfigureIsCopy(isCopy);
    setCostingConfigConfigureModalVisible(true);
  };

  const getCostingTypeName = (type: CostingType) => {
    return type === CostingType.Claims ? Claims_FriendlyName : PatientCare_FriendlyName;
  };

  return (
    <>
      <Modal title='All Models' visible={props.visible} onCancel={handleCancel} footer={null} width='extraLarge' removeBodyPadding>
        <ActionBar
          filters={<Input search width={200} onChange={(e) => setGlobalFilterValue({ fields: ['name', 'description'], value: e.target.value })} />}
          actions={
            <>
              <Button
                icon='Plus'
                onClick={() => {
                  openCostingConfigConfigureModal(newCostConfig(), false);
                }}
              >
                Add Model
              </Button>
            </>
          }
        />
        <DataGrid key='allModelsGrid' pager={{ pageSize: 10 }} dataKey='costingConfigGuid' value={costingConfigs} globalFilterValue={globalFilterValue}>
          <DataGrid.RowNumber />
          <DataGrid.Column
            header='Name'
            width={315}
            sortable
            field='name'
            align='left'
            body={(rowData) => (
              <>
                <Button type='link' onClick={() => handleChangeConfig(rowData.costingConfigGuid)}>
                  {rowData.name}
                </Button>
              </>
            )}
          ></DataGrid.Column>
          <DataGrid.Column header='Description' field='description' collapseLongText width={275} sortable />
          <DataGrid.Column header='Type' field='type' width={120} body={(rowData) => getCostingTypeName(rowData.type)} sortable />
          <DataGrid.Column header='Fiscal Year' align='right' field='fiscalYearId' width={104} sortable />
          <DataGrid.DateColumn header='Last Edit' field='modifiedAtUtc' sortable width={128} />
          <DataGrid.DateColumn header='Last Published' field='lastPublishedUtc' sortable width={128} />
          <DataGrid.Column
            align='right'
            width={80}
            body={(rowData) => (
              <>
                <Tooltip title='Copy'>
                  <Button type='link' icon='Copy' onClick={() => openCostingConfigConfigureModal(rowData, true)}></Button>
                </Tooltip>
                <Tooltip title='Delete'>
                  <Button type='link' icon='Delete' disabled={!rowData.isEditable} onClick={() => handleDelete(rowData.costingConfigGuid)}></Button>
                </Tooltip>
              </>
            )}
          ></DataGrid.Column>
        </DataGrid>
      </Modal>
      <CostingConfigConfigureModal
        visible={costingConfigConfigureModalVisible}
        costingConfig={costingConfigForConfigure}
        isCopy={costingConfigConfigureIsCopy}
        onCancel={() => {
          setCostingConfigConfigureModalVisible(false);
        }}
        onSave={handleAddConfig}
        costingConfigs={costingConfigs}
      ></CostingConfigConfigureModal>
    </>
  );
};

export default CostingConfigsModal;
