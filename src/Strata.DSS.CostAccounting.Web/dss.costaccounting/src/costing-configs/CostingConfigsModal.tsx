import Button from '@strata/tempo/lib/button';
import Modal from '@strata/tempo/lib/modal';
import Spacing from '@strata/tempo/lib/spacing';
import Tooltip from '@strata/tempo/lib/tooltip';
import React, { useEffect, useState } from 'react';
import { ICostingConfig } from '../shared/data/ICostingConfig';
import { CostingType } from '../shared/enums/CostingTypeEnum';
import Input from '@strata/tempo/lib/input';
import { CostingConfigService } from '../shared/data/CostingConfigService';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid, { IGlobalFilterValue } from '@strata/tempo/lib/datagrid/DataGrid';
import CostingConfigConfigureModal from './CostingConfigConfigureModal';
import Toast from '@strata/tempo/lib/toast';
import { ICostingConfigForm, getNewCostingConfigForm } from './data/ICostingConfigForm';
import { EntityType } from './enums/EntityTypeEnum';
import { PatientCare_FriendlyName, Claims_FriendlyName } from './constants/CostingTypeConstants';
import { ICostingConfigEntityLinkage } from './data/ICostingConfigEntityLinkage';
import { CostingOption } from './enums/CostingOptionEnum';

export interface ICostingConfigsModalProps {
  visible: boolean;
  onCancel: () => void;
  onChangeConfigs: (costingConfigGuid: string) => void;
}

const CostingConfigsModal: React.FC<ICostingConfigsModalProps> = (props: ICostingConfigsModalProps) => {
  const newCostingConfigForm: ICostingConfigForm = getNewCostingConfigForm();

  const [costingConfigConfigureModalVisible, setCostingConfigConfigureModalVisible] = React.useState<boolean>(false);
  const [costingConfigs, setCostingConfigs] = useState<ICostingConfig[]>([]);
  const [costingConfigForm, setCostingConfigForm] = useState<ICostingConfigForm>(newCostingConfigForm);
  const [globalFilterValue, setGlobalFilterValue] = useState<IGlobalFilterValue>({ fields: ['name', 'description'], value: '' });
  const [costingConfigConfigureTitle, setcostingConfigConfigureTitle] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setCostingConfigs(await CostingConfigService.getCostingConfigs());
    };
    fetchData();
  }, []);

  const handleAddConfig = (newConfig: ICostingConfig) => {
    setCostingConfigConfigureModalVisible(false);
    const updatedCostConfigs = [...costingConfigs, newConfig];
    setCostingConfigs(updatedCostConfigs);
  };

  const handleCopyCostingConfig = (costingConfig: ICostingConfig) => {
    const fetchEntities = async (costingConfigGuid: string) => {
      const entityLinkages: ICostingConfigEntityLinkage[] = await CostingConfigService.getCostingConfigEntityLinkages(costingConfigGuid);
      const glPayrollEntities: string[] = entityLinkages.filter((x) => x.isUtilization === false).map((x) => x.entityId.toString());
      const utilizationEntities: string[] = entityLinkages.filter((x) => x.isUtilization === true).map((x) => x.entityId.toString());

      const costingConfigForm: ICostingConfigForm = {
        name: costingConfig.name + ' - Copy',
        description: costingConfig.description,
        year: costingConfig.fiscalYearId,
        ytdMonth: costingConfig.fiscalMonthId,
        type: costingConfig.type,
        glPayrollEntities: glPayrollEntities,
        entityType: costingConfig.isUtilizationEntityConfigured ? EntityType.Specify : EntityType.GlPayroll,
        utilizationEntities: utilizationEntities,
        defaultMethod: costingConfig.defaultMethod,
        options: [
          costingConfig.isBudgetedAndActualCosting ? CostingOption.BudgetedAndActualCosting : CostingOption.NotSpecified,
          costingConfig.isPayrollCosting ? CostingOption.PayrollCosting : CostingOption.NotSpecified
        ],
        isCopy: true
      };

      setcostingConfigConfigureTitle('Copy Model');
      openCostingConfigConfigureModal(true, costingConfigForm);
    };

    fetchEntities(costingConfig.costingConfigGuid);
  };

  const handleDelete = (costingConfigGuid: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this Costing Configuration?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        CostingConfigService.deleteCostingConfig(costingConfigGuid);
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
        <DataGrid key='allModelsGrid' scrollable dataKey='costingConfigGuid' value={costingConfigs} globalFilterValue={globalFilterValue}>
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
          <DataGrid.Column header='Fiscal Year' field='fiscalYearId' width={104} sortable />
          <DataGrid.DateColumn header='Last Edit' field='modifiedAtUtc' sortable width={128} />
          <DataGrid.DateColumn header='Last Published' field='lastPublishedUtc' sortable width={128} />
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
        costingConfigs={costingConfigs}
      ></CostingConfigConfigureModal>
    </>
  );
};

export default CostingConfigsModal;
