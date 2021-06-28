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
import { CostingConfigService } from '../shared/data/CostingConfigService';
import { systemSettingService } from '../shared/data/systemSettingService';
import { dateService } from '../shared/data/dateService';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { ICostingConfigSaveData } from './data/ICostingConfigSaveData';
import { ICostingConfigForm } from './data/ICostingConfigForm';
import TreeDropDown, { ITreeDropDownNode } from '@strata/tempo/lib/treedropdown';
import { ICostingConfig } from '../shared/data/ICostingConfig';
import { getEmptyGuid } from '../shared/Utils';
import { Simultaneous_FriendlyName, SingleStepDown_FriendlyName } from './constants/CostingMethodConstants';
import { PatientCare_FriendlyName, Claims_FriendlyName } from './constants/CostingTypeConstants';
import { CostingMethod } from './enums/CostingMethodEnum';
import { CostingType } from '../shared/enums/CostingTypeEnum';
import { EntityType } from './enums/EntityTypeEnum';
import { CostingOption } from './enums/CostingOptionEnum';

interface ICostingConfigConfigureModalProps {
  visible: boolean;
  title: string;
  costingConfigForm: ICostingConfigForm;
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
  const [costingType, setCostingType] = useState<number>(0);
  const [entityUtilType, setEntityUtilType] = useState<number>(0);
  const [entityTreeData, setEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [utilizationEntityTreeData, setUtilizationEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [isClaimsCostingEnabled, setIsClaimsCostingEnabled] = useState<boolean>(false);
  const [isCostingEntityLevelSecurityEnabled, setIsCostingEntityLevelSecurityEnabled] = useState<boolean>(false);
  const emptyGuid = getEmptyGuid();

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
          CostingConfigService.getGlPayrollEntities(emptyGuid),
          isCostingEntityLevelSecurityEnabled ? CostingConfigService.getUtilizationEntities() : []
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
        isUtilizationEntityConfigured: values.entityType === EntityType.Specify,
        defaultChargeAllocationMethod: 0,
        defaultMethod: values.defaultMethod,
        fiscalYearId: values.year,
        fiscalMonthId: values.ytdMonth,
        type: values.type,
        createdAt: new Date(),
        modifiedAtUtc: new Date(),
        lastPublishedUtc: new Date(),
        isEditable: true
      };

      const configSaveData: ICostingConfigSaveData = {
        costingConfig: newConfig,
        glPayrollEntities: values.glPayrollEntities.map((x) => +x),
        utilizationEntities: values.type === CostingType.PatientCare && values.entityType === EntityType.Specify ? values.utilizationEntities.map((x) => +x) : []
      };

      try {
        setLoading(true);
        const newConfig = await CostingConfigService.addNewCostingConfig(configSaveData);
        Toast.show({ message: 'Changes Saved', toastType: 'success' });
        //reset form
        form.resetFields();
        setCostingType(0);
        setEntityUtilType(0);
        props.onSave(newConfig);
      } catch (error) {
        Toast.show({ message: 'Changes not saved. Try again and contact your administrator if the issue continues.', toastType: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setCostingType(0);
    setEntityUtilType(0);
    form.resetFields();
    props.onCancel();
    Toast.show({ message: 'Changes Discarded', toastType: 'info' });
  };

  const handleSave = () => {
    form.submit();
  };

  const handleEntityTypeChange = (e: RadioChangeEvent) => {
    setEntityUtilType(e.target.value);
  };

  const handleCostingTypeChange = (e: RadioChangeEvent) => {
    setCostingType(e.target.value);
  };

  const getYearInitialValue = () => {
    if (props.costingConfigForm.isCopy) return props.costingConfigForm.year;

    const year = fiscalYears.find((x) => x.fiscalYearId === new Date().getFullYear())?.fiscalYearId;
    return year ? year : fiscalYears[fiscalYears.length - 1];
  };

  const getMonthInitialValue = () => {
    if (props.costingConfigForm.isCopy) return props.costingConfigForm.ytdMonth;

    const ytdMonth = fiscalMonths.find((x) => x.sortOrder === 12)?.fiscalMonthId;
    return ytdMonth ? ytdMonth : fiscalMonths[fiscalMonths.length - 1];
  };

  const getGlPayrollEntitiesInitialValue = () => {
    if (props.costingConfigForm.isCopy) return props.costingConfigForm.glPayrollEntities.length > 0 ? props.costingConfigForm.glPayrollEntities : ['0'];

    const fEntities = glPayrollEntities.map((x) => x.entityId.toString());
    return fEntities.length > 0 ? fEntities : ['0'];
  };

  const getUtilizationEntitiesitiesInitialValue = () => {
    if (props.costingConfigForm.isCopy) return props.costingConfigForm.utilizationEntities.length > 0 ? props.costingConfigForm.utilizationEntities : ['0'];

    const uEntities = utilizationEntities.map((x) => x.entityId.toString());
    return uEntities.length > 0 ? uEntities : ['0'];
  };

  return (
    <>
      <Modal
        title={props.title}
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
          <Form.Item label='Name' name='name' initialValue={props.costingConfigForm.name} rules={[{ required: true, whitespace: true, max: 50 }, { pattern: /^[A-Za-z0-9 _-]*$/ }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Description' name='description' initialValue={props.costingConfigForm.description} rules={[{ max: 2000 }]}>
            <InputTextArea />
          </Form.Item>
          <Spacing itemSpacing={16}>
            <Form.Item label='Year' name='year' initialValue={getYearInitialValue()} rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalYearId' itemTextField='name' items={fiscalYears} />
            </Form.Item>
            <Form.Item label='YTD Month' name='ytdMonth' initialValue={getMonthInitialValue()} rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalMonthId' itemTextField='name' items={fiscalMonths} />
            </Form.Item>
          </Spacing>
          <Spacing itemSpacing={16}>
            {isClaimsCostingEnabled && (
              <Form.Item label='Type' name='type' initialValue={props.costingConfigForm.type} rules={[{ required: true }]}>
                <RadioGroup
                  onChange={handleCostingTypeChange}
                  options={[
                    { value: CostingType.PatientCare, label: PatientCare_FriendlyName },
                    { value: CostingType.Claims, label: Claims_FriendlyName }
                  ]}
                />
              </Form.Item>
            )}
            <Form.Item label='GL/Payroll Entities' name='glPayrollEntities' initialValue={getGlPayrollEntitiesInitialValue()} rules={[{ required: true }]}>
              <TreeDropDown treeData={entityTreeData} selectionMode='multiple' treeDefaultExpandedKeys={['0']} />
            </Form.Item>
          </Spacing>
          {isCostingEntityLevelSecurityEnabled && (
            <Spacing itemSpacing={16}>
              <Form.Item label='Utilization Entities' name='entityType' initialValue={props.costingConfigForm.entityType} rules={[{ required: true }]}>
                <RadioGroup
                  onChange={handleEntityTypeChange}
                  options={[
                    { value: EntityType.GlPayroll, label: 'Same as GL/Payroll' },
                    { value: EntityType.Specify, label: 'Specify' }
                  ]}
                />
              </Form.Item>
              {entityUtilType === EntityType.Specify && (
                <Form.Item label='Specifiy Utilization Entities' name='utilizationEntities' initialValue={getUtilizationEntitiesitiesInitialValue()} rules={[{ required: true }]}>
                  <TreeDropDown treeData={utilizationEntityTreeData} selectionMode='multiple' treeDefaultExpandedKeys={['0']} />
                </Form.Item>
              )}
            </Spacing>
          )}
          {costingType === CostingType.PatientCare && (
            <Spacing itemSpacing={16}>
              <Form.Item label='Method' name='defaultMethod' initialValue={props.costingConfigForm.defaultMethod} rules={[{ required: true }]}>
                <RadioGroup
                  options={[
                    { value: CostingMethod.Simultaneous, label: Simultaneous_FriendlyName },
                    { value: CostingMethod.SingleStepDown, label: SingleStepDown_FriendlyName }
                  ]}
                />
              </Form.Item>
              <Form.Item label='Additional Data' name='options' initialValue={props.costingConfigForm.options} rules={[{ required: false }]}>
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
