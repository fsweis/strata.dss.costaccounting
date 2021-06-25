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
import CostingConfigConfigureModal from './CostingConfigConfigureModal';
import Toast from '@strata/tempo/lib/toast';
import { ICostingConfigForm } from './data/ICostingConfigForm';
import { CostingMethod } from './enums/CostingMethodEnum';
import { EntityType } from './enums/EntityTypeEnum';
import { PatientCare_FriendlyName, Claims_FriendlyName } from './constants/CostingTypeConstants';
import { ICostingConfigEntityLinkage } from './data/ICostingConfigEntityLinkage';

export interface ICostingConfigsModalProps {
  visible: boolean;
  onCancel: () => void;
  onChangeConfigs: (costingConfigGuid: string) => void;
}

const CostingConfigsModal: React.FC<ICostingConfigsModalProps> = (props: ICostingConfigsModalProps) => {
  const newCostingConfigForm: ICostingConfigForm = {
    name: '',
    description: '',
    year: 0,
    ytdMonth: 0,
    type: CostingType.PatientCare,
    glPayrollEntities: [],
    entityType: EntityType.GlPayroll,
    utilEntities: [],
    defaultMethod: CostingMethod.Simultaneous,
    options: [0, 0],
    isCopy: false
  };

  const [costingConfigConfigureModalVisible, setCostingConfigConfigureModalVisible] = React.useState<boolean>(false);
  const [costConfigs, setCostConfigs] = useState<ICostConfig[]>([]);
  const [costingConfigForm, setCostingConfigForm] = useState<ICostingConfigForm>(newCostingConfigForm);
  const [globalFilterValue, setGlobalFilterValue] = useState<IGlobalFilterValue>({ fields: ['name', 'description'], value: '' });
  const [costingConfigConfigureTitle, setcostingConfigConfigureTitle] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setCostConfigs(await costConfigService.getCostConfigs());
    };
    fetchData();
  }, []);

  const handleAddConfig = (newConfig: ICostConfig) => {
    setCostingConfigConfigureModalVisible(false);
    //TODO: add to list.
  };

  const handleCopyCostingConfig = (costingConfig: ICostConfig) => {
    let glPayrollEntities: string[] = [];
    let utilEntities: string[] = [];

    const fetchEntities = async (costingConfigGuid: string) => {
      const entityLinkages: ICostingConfigEntityLinkage[] = await costConfigService.getCostingConfigEntityLinkages(costingConfigGuid);
      glPayrollEntities = entityLinkages.filter((x) => x.isUtilization === false).map((x) => x.entityId.toString());
      utilEntities = entityLinkages.filter((x) => x.isUtilization === true).map((x) => x.entityId.toString());
    };

    fetchEntities(costingConfig.costingConfigGuid);

    const costingConfigForm: ICostingConfigForm = {
      name: costingConfig.name + ' - Copy',
      description: costingConfig.description,
      year: costingConfig.fiscalYearId,
      ytdMonth: costingConfig.fiscalMonthId,
      type: costingConfig.type,
      glPayrollEntities: glPayrollEntities,
      entityType: EntityType.GlPayroll, //TODO: Update this in service
      utilEntities: utilEntities,
      defaultMethod: costingConfig.defaultMethod,
      options: [costingConfig.isBudgetedAndActualCosting ? 1 : 0, costingConfig.isPayrollCosting ? 2 : 0],
      isCopy: true
    };
    setcostingConfigConfigureTitle('Copy Model');
    openCostingConfigConfigureModal(true, costingConfigForm);
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

  const openCostingConfigConfigureModal = (isVisible: boolean, costingConfigForm: ICostingConfigForm) => {
    setCostingConfigForm(costingConfigForm);
    setCostingConfigConfigureModalVisible(isVisible);
  };

  const getCostingTypeName = (type: CostingType) => {
    return type === CostingType.Claims ? Claims_FriendlyName : PatientCare_FriendlyName;
  };

  return (
    <>
      <Modal title='All Models' visible={props.visible} onCancel={props.onCancel} footer={null} width='extraLarge'>
        <ActionBar
          filters={<Input search width={200} onChange={(e) => setGlobalFilterValue({ fields: ['name', 'description'], value: e.target.value })} />}
          actions={
            <>
              <Button
                icon='Plus'
                onClick={() => {
                  setcostingConfigConfigureTitle('New Model');
                  openCostingConfigConfigureModal(true, newCostingConfigForm);
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
                  <Button type='link' onClick={() => props.onChangeConfigs(rowData.costingConfigGuid)}>
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
                    <Button type='link' icon='Copy' onClick={() => handleCopyCostingConfig(rowData)}></Button>
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
      <CostingConfigConfigureModal
        visible={costingConfigConfigureModalVisible}
        costingConfigForm={costingConfigForm}
        onCancel={() => {
          setCostingConfigConfigureModalVisible(false);
        }}
        onSave={handleAddConfig}
        title={costingConfigConfigureTitle}
        costConfigs={costConfigs}
      ></CostingConfigConfigureModal>
    </>
  );
};

export default CostingConfigsModal;
