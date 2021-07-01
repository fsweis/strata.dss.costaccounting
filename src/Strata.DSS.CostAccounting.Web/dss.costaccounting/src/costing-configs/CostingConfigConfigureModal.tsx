import React, { useEffect, useState } from 'react';
import Modal from '@strata/tempo/lib/modal';
import Input from '@strata/tempo/lib/input';
import Button from '@strata/tempo/lib/button';
import Form from '@strata/tempo/lib/form';
import InputTextArea from '@strata/tempo/lib/inputtextarea';
import RadioGroup from '@strata/tempo/lib/radiogroup';
import CheckboxGroup from '@strata/tempo/lib/checkboxgroup';
import Toast from '@strata/tempo/lib/toast';
import Spacing from '@strata/tempo/lib/spacing';
import DropDown from '@strata/tempo/lib/dropdown';
import { usePageLoader } from '@strata/tempo/lib/pageloader';
import { IFiscalYear } from '../shared/data/IFiscalYear';
import { IFiscalMonth } from '../shared/data/IFiscalMonth';
import { IEntity } from './data/IEntity';
import { costingConfigService } from '../shared/data/costingConfigService';
import { systemSettingService } from '../shared/data/systemSettingService';
import { dateService } from '../shared/data/dateService';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { ICostingConfigSaveData } from './data/ICostingConfigSaveData';
import { getNewCostingConfigForm, ICostingConfigForm } from './data/ICostingConfigForm';
import TreeDropDown, { ITreeDropDownNode } from '@strata/tempo/lib/treedropdown';
import { ICostingConfig } from '../shared/data/ICostingConfig';
import { getEmptyGuid } from '../shared/Utils';
import { Simultaneous_FriendlyName, SingleStepDown_FriendlyName } from './constants/CostingMethodConstants';
import { PatientCare_FriendlyName, Claims_FriendlyName } from './constants/CostingTypeConstants';
import { CostingMethod } from './enums/CostingMethodEnum';
import { CostingType } from '../shared/enums/CostingTypeEnum';
import { EntityType } from './enums/EntityTypeEnum';
import { CostingOption } from './enums/CostingOptionEnum';
import { ICostingConfigEntityLinkage } from './data/ICostingConfigEntityLinkage';

interface ICostingConfigConfigureModalProps {
  visible: boolean;
  isCopy: boolean;
  costingConfig: ICostingConfig;
  costingConfigs: ICostingConfig[];
  onCancel: () => void;
  onSave: (costingConfig: ICostingConfig) => void;
}

const CostingConfigConfigureModal: React.FC<ICostingConfigConfigureModalProps> = (props: ICostingConfigConfigureModalProps) => {
  const [form] = Form.useForm();
  const [fiscalYears, setFiscalYears] = useState<IFiscalYear[]>([]);
  const [fiscalMonths, setFiscalMonths] = useState<IFiscalMonth[]>([]);
  const [utilizationEntities, setUtililizationEntities] = useState<IEntity[]>([]);
  const [glPayrollEntities, setGlPayrollEntities] = useState<IEntity[]>([]);
  const { setLoading } = usePageLoader();
  const [entityTreeData, setEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [utilizationEntityTreeData, setUtilizationEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [isClaimsCostingEnabled, setIsClaimsCostingEnabled] = useState<boolean>(false);
  const [isCostingEntityLevelSecurityEnabled, setIsCostingEntityLevelSecurityEnabled] = useState<boolean>(false);
  const emptyGuid = getEmptyGuid();

  const [costingConfigForm, setCostingConfigForm] = useState<ICostingConfigForm>(getNewCostingConfigForm);
  const [costingType, setCostingType] = useState<CostingType>(props.costingConfig.type);
  const [entityType, setEntityType] = useState<EntityType>(EntityType.GlPayroll);
  const [title, setTitle] = useState<string>('');

  //Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [isClaimsCostingEnabled, isCostingEntityLevelSecurityEnabled] = await Promise.all([
          systemSettingService.getIsClaimsCostingEnabled(),
          systemSettingService.getIsCostingEntityLevelSecurityEnabled()
        ]);
        setIsClaimsCostingEnabled(isClaimsCostingEnabled);
        setIsCostingEntityLevelSecurityEnabled(isCostingEntityLevelSecurityEnabled);

        const [fiscalMonths, fiscalYears, glPayrollEntities, utilizationEntities] = await Promise.all([
          dateService.getFiscalMonths(),
          dateService.getFiscalYears(),
          costingConfigService.getGlPayrollEntities(emptyGuid),
          isCostingEntityLevelSecurityEnabled ? costingConfigService.getUtilizationEntities() : []
        ]);
        setFiscalMonths(fiscalMonths);
        setFiscalYears(fiscalYears);
        setGlPayrollEntities(glPayrollEntities);
        setUtililizationEntities(utilizationEntities);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading, emptyGuid]);

  useEffect(() => {
    const costingConfigForm: ICostingConfigForm = {
      ...props.costingConfig,
      glPayrollEntities: [],
      entityType: props.costingConfig.isUtilizationEntityConfigured ? EntityType.Specify : EntityType.GlPayroll,
      utilizationEntities: [],
      options: [CostingOption.NotSpecified, CostingOption.NotSpecified],
      isCopy: props.isCopy
    };

    setCostingType(costingConfigForm.type);
    setEntityType(costingConfigForm.entityType);

    if (!costingConfigForm.isCopy) {
      setTitle('New Model');

      if (fiscalYears && fiscalYears.length > 0) {
        const fiscalYearId = fiscalYears.find((x) => x.fiscalYearId === new Date().getFullYear())?.fiscalYearId;
        costingConfigForm.fiscalYearId = fiscalYearId ? fiscalYearId : fiscalYears[fiscalYears.length - 1].fiscalYearId;
      }

      if (fiscalMonths && fiscalMonths.length > 0) {
        const fiscalMonthId = fiscalMonths.find((x) => x.sortOrder === 12)?.fiscalMonthId;
        costingConfigForm.fiscalMonthId = fiscalMonthId ? fiscalMonthId : fiscalMonths[fiscalMonths.length - 1].fiscalMonthId;
      }

      const fEntities = glPayrollEntities.map((x) => x.entityId.toString());
      const uEntities = utilizationEntities.map((x) => x.entityId.toString());
      costingConfigForm.glPayrollEntities = fEntities.length > 0 ? fEntities : ['0'];
      costingConfigForm.utilizationEntities = uEntities.length > 0 ? uEntities : ['0'];

      setCostingConfigForm(costingConfigForm);
      form.resetFields();
    } else {
      setTitle('Copy Model');
      costingConfigForm.options = [
        props.costingConfig.isBudgetedAndActualCosting ? CostingOption.BudgetedAndActualCosting : CostingOption.NotSpecified,
        props.costingConfig.isPayrollCosting ? CostingOption.PayrollCosting : CostingOption.NotSpecified
      ];

      const getCostingConfigEntitiesForCopy = async (costingConfigGuid: string) => {
        const entityLinkages: ICostingConfigEntityLinkage[] = await costingConfigService.getCostingConfigEntityLinkages(costingConfigGuid);
        const glPayrollEntities: string[] = entityLinkages.filter((x) => x.isUtilization === false).map((x) => x.entityId.toString());
        const utilizationEntities: string[] = entityLinkages.filter((x) => x.isUtilization === true).map((x) => x.entityId.toString());

        costingConfigForm.glPayrollEntities = glPayrollEntities.length > 0 ? glPayrollEntities : ['0'];
        costingConfigForm.utilizationEntities = utilizationEntities.length > 0 ? utilizationEntities : ['0'];

        setCostingConfigForm(costingConfigForm);
        form.resetFields();
      };

      getCostingConfigEntitiesForCopy(props.costingConfig.costingConfigGuid);
    }
  }, [props.costingConfig]);

  //Set Filtered Entity Trees when entities are loaded
  useEffect(() => {
    const glPayrollEntityTree = getEntityTree(glPayrollEntities);
    setEntityTreeData(glPayrollEntityTree);
  }, [glPayrollEntities]);

  //Set Utilization Entity Trees when entities are loaded
  useEffect(() => {
    const utilizationEntityTree = getEntityTree(utilizationEntities);
    setUtilizationEntityTreeData(utilizationEntityTree);
  }, [utilizationEntities]);

  //Tree Util
  const getEntityTree = (entities: IEntity[]) => {
    const entityTreeChildren = entities.map((entity) => {
      return { key: entity.entityId.toString(), title: entity.description, value: entity.entityId.toString() };
    });
    const entityTree = [
      {
        key: '0',
        title: entities.length > 0 ? 'All Entities' : 'None',
        value: '0',
        children: entityTreeChildren.filter((x) => x.key !== '0' && x.title !== '')
      }
    ];
    return entityTree;
  };

  //Form Finish
  const onFormFinish = async (vals: { [name: string]: any }) => {
    const values = vals as ICostingConfigForm;
    const cleanedName = values.name.replace(/\s+/g, ' ').trim();
    //Duplicate name check
    if (props.costingConfigs.find((x) => x.name.toLowerCase() === cleanedName.toLowerCase()) !== undefined) {
      Toast.show({ message: 'Duplicate names are not allowed.', toastType: 'info' });
    } else {
      let isPayrollCosting = false;
      let isBudgetedAndActualCosting = false;

      if (costingType === CostingType.PatientCare) {
        isBudgetedAndActualCosting = values.options[0] === CostingOption.BudgetedAndActualCosting ? true : false;
        isPayrollCosting = values.options[1] === CostingOption.PayrollCosting ? true : false;
      }

      //Create new cost model
      const newConfig: ICostingConfig = {
        costingConfigGuid: emptyGuid,
        name: cleanedName,
        description: values.description,
        isGLCosting: true,
        isPayrollCosting: isPayrollCosting,
        isBudgetedAndActualCosting: isBudgetedAndActualCosting,
        isUtilizationEntityConfigured: entityType === EntityType.Specify,
        defaultChargeAllocationMethod: 0,
        defaultMethod: values.defaultMethod,
        fiscalYearId: values.fiscalYearId,
        fiscalMonthId: values.fiscalMonthId,
        type: costingType,
        createdAt: new Date(),
        modifiedAtUtc: new Date(),
        lastPublishedUtc: new Date(),
        isEditable: true
      };

      const configSaveData: ICostingConfigSaveData = {
        costingConfig: newConfig,
        glPayrollEntities: values.glPayrollEntities.map((x) => +x),
        utilizationEntities: entityType === EntityType.Specify ? values.utilizationEntities.map((x) => +x) : []
      };

      try {
        setLoading(true);
        const newConfig = await costingConfigService.addNewCostingConfig(configSaveData);
        Toast.show({ message: 'Changes Saved', toastType: 'success' });

        //reset form
        form.resetFields();
        props.onSave(newConfig);
      } catch (error) {
        Toast.show({ message: 'Changes not saved. Try again and contact your administrator if the issue continues.', toastType: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    props.onCancel();
    Toast.show({ message: 'Changes Discarded', toastType: 'info' });
  };

  const handleSave = () => {
    form.submit();
  };

  const handleCostingTypeChange = (e: RadioChangeEvent) => {
    setCostingType(e.target.value);
  };

  const handleEntityTypeChange = (e: RadioChangeEvent) => {
    setEntityType(e.target.value);
  };

  return (
    <>
      <Modal
        title={title}
        visible={props.visible}
        destroyOnClose
        onCancel={handleCancel}
        onOk={handleSave}
        okText='Save'
        footer={
          <>
            <Spacing hAlign={'space-between'}>
              <Button type='tertiary' icon='InfoCircle' />
              <Spacing>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type='primary' htmlType='submit' onClick={handleSave}>
                  Save
                </Button>
              </Spacing>
            </Spacing>
          </>
        }
      >
        <Form form={form} onFinish={onFormFinish} layout={'vertical'} preserve={false}>
          <Form.Item label='Name' name='name' initialValue={costingConfigForm.name} rules={[{ required: true, whitespace: true, max: 50 }, { pattern: /^[A-Za-z0-9 _-]*$/ }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Description' name='description' initialValue={costingConfigForm.description} rules={[{ max: 2000 }]}>
            <InputTextArea />
          </Form.Item>
          <Spacing itemSpacing={16}>
            <Form.Item label='Year' name='year' initialValue={costingConfigForm.fiscalYearId} rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalYearId' itemTextField='name' items={fiscalYears} />
            </Form.Item>
            <Form.Item label='YTD Month' name='ytdMonth' initialValue={costingConfigForm.fiscalMonthId} rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalMonthId' itemTextField='name' items={fiscalMonths} />
            </Form.Item>
          </Spacing>
          <Spacing itemSpacing={16}>
            {isClaimsCostingEnabled && (
              <Form.Item label='Type' name='type' initialValue={costingConfigForm.type} rules={[{ required: true }]}>
                <RadioGroup
                  onChange={handleCostingTypeChange}
                  options={[
                    { value: CostingType.PatientCare, label: PatientCare_FriendlyName },
                    { value: CostingType.Claims, label: Claims_FriendlyName }
                  ]}
                />
              </Form.Item>
            )}
            <Form.Item label='GL/Payroll Entities' name='glPayrollEntities' initialValue={costingConfigForm.glPayrollEntities} rules={[{ required: true }]}>
              <TreeDropDown treeData={entityTreeData} selectionMode='multiple' treeDefaultExpandedKeys={['0']} />
            </Form.Item>
          </Spacing>
          {isCostingEntityLevelSecurityEnabled && (
            <Spacing itemSpacing={16}>
              <Form.Item label='Utilization Entities' name='entityType' initialValue={costingConfigForm.entityType} rules={[{ required: true }]}>
                <RadioGroup
                  onChange={handleEntityTypeChange}
                  options={[
                    { value: EntityType.GlPayroll, label: 'Same as GL/Payroll' },
                    { value: EntityType.Specify, label: 'Specify' }
                  ]}
                />
              </Form.Item>
              {entityType === EntityType.Specify && (
                <Form.Item label='Specify Utilization Entities' name='utilizationEntities' initialValue={costingConfigForm.utilizationEntities} rules={[{ required: true }]}>
                  <TreeDropDown treeData={utilizationEntityTreeData} selectionMode='multiple' treeDefaultExpandedKeys={['0']} />
                </Form.Item>
              )}
            </Spacing>
          )}
          {costingType === CostingType.PatientCare && (
            <Spacing itemSpacing={16}>
              <Form.Item label='Method' name='defaultMethod' initialValue={costingConfigForm.defaultMethod} rules={[{ required: true }]}>
                <RadioGroup
                  options={[
                    { value: CostingMethod.Simultaneous, label: Simultaneous_FriendlyName },
                    { value: CostingMethod.SingleStepDown, label: SingleStepDown_FriendlyName }
                  ]}
                />
              </Form.Item>
              <Form.Item label='Additional Data' name='options' initialValue={costingConfigForm.options} rules={[{ required: false }]}>
                <CheckboxGroup
                  options={[
                    { value: CostingOption.BudgetedAndActualCosting, label: 'Include Budget' },
                    { value: CostingOption.PayrollCosting, label: 'Include Payroll' }
                  ]}
                />
              </Form.Item>
            </Spacing>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default CostingConfigConfigureModal;
