import React from 'react';
import Modal from '@strata/tempo/lib/modal';
import Input from '@strata/tempo/lib/input';
import Button from '@strata/tempo/lib/button';
import Form from '@strata/tempo/lib/form';
import InputTextArea from '@strata/tempo/lib/inputtextarea';
import RadioGroup from '@strata/tempo/lib/radiogroup';
import CheckboxGroup from '@strata/tempo/lib/checkboxgroup';
import Toast from '@strata/tempo/lib/toast';
import { useEffect, useState } from 'react';
import Spacing from '@strata/tempo/lib/spacing';
import DropDown from '@strata/tempo/lib/dropdown';
import { usePageLoader } from '@strata/tempo/lib/pageloader';
import { IFiscalYear } from '../shared/data/IFiscalYear';
import { IFiscalMonth } from '../shared/data/IFiscalMonth';
import { IEntity } from './data/IEntity';
import { costConfigService } from '../shared/data/costConfigService';
import { systemSettingService } from '../shared/data/systemSettingService';
import { dateService } from '../shared/data/dateService';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { ICostingType } from './data/ICostingType';
import { ICostingMethod } from './data/ICostingMethod';
import { ICostConfigSaveData } from './data/ICostConfigSaveData';
import TreeDropDown, { ITreeDropDownNode } from '@strata/tempo/lib/treedropdown';
import { getEmptyGuid } from '../shared/Utils';
import { ICostConfig } from '../shared/data/ICostConfig';

interface IModelModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  onAddConfig: (costingConfig: ICostConfig) => void;
}

interface IConfigForm {
  name: string;
  description: string;
  year: number;
  ytdMonth: number;
  type: number;
  glPayrollEntities: string[];
  isUtilizingEntities: number;
  utilEntities: string[];
  method: number;
  options: number[];
}

const CostingConfigModal: React.FC<IModelModalProps> = (props: IModelModalProps) => {
  const [form] = Form.useForm();
  const [fiscalYears, setFiscalYears] = useState<IFiscalYear[]>([]);
  const [fiscalMonths, setFiscalMonths] = useState<IFiscalMonth[]>([]);
  const [utilEntities, setUtilEntities] = useState<IEntity[]>([]);
  const [glPayrollEntities, setGlPayrollEntities] = useState<IEntity[]>([]);
  const { setLoading } = usePageLoader();
  const [costingType, setCostingType] = useState<number>(0);
  const [entityUtilType, setEntityUtilType] = useState<number>(0);
  const [costingTypes, setCostingTypes] = useState<ICostingType[]>([]);
  const [costingMethods, setCostingMethods] = useState<ICostingMethod[]>([]);
  const [entityTreeData, setEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [utilEntityTreeData, setUtilEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [isClaimsCostingEnabled, setIsClaimsCostingEnabled] = useState<boolean>(false);
  const [isCostingEntityLevelSecurityEnabled, setIsCostingEntityLevelSecurityEnabled] = useState<boolean>(false);
  const [configForm, setConfigForm] = useState<IConfigForm>();

  //Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [isClaimsCostingEnabled, isCostingEntityLevelSecurityEnabled] = await Promise.all([
          systemSettingService.getIsClaimsCostingEnabled(),
          systemSettingService.getIsCostingEntityLevelSecurityEnabled()
        ]);
        setIsClaimsCostingEnabled(isClaimsCostingEnabled);
        setIsCostingEntityLevelSecurityEnabled(isCostingEntityLevelSecurityEnabled);

        const [fiscalMonths, fiscalYears, glPayrollEntities, utilEntities, costingTypes, costingMethods] = await Promise.all([
          dateService.getFiscalMonths(),
          dateService.getFiscalYears(),
          costConfigService.getGlPayrollEntities(getEmptyGuid()),
          isCostingEntityLevelSecurityEnabled ? costConfigService.getUtilEntities() : [],
          costConfigService.getCostingTypes(),
          costConfigService.getCostingMethods()
        ]);
        setFiscalMonths(fiscalMonths);
        setFiscalYears(fiscalYears);
        setGlPayrollEntities(glPayrollEntities);
        setUtilEntities(utilEntities);
        setCostingTypes(costingTypes);
        setCostingMethods(costingMethods);
        //set initial form
        const year = fiscalYears.find((x) => x.fiscalYearId === new Date().getFullYear())?.fiscalYearId;
        const ytdMonth = fiscalMonths.find((x) => x.sortOrder === 12)?.fiscalMonthId;
        const fEntities = glPayrollEntities.map((x) => x.entityId.toString());
        const uEntities = utilEntities.map((x) => x.entityId.toString());
        const configForm = {
          name: '',
          description: '',
          year: year ? year : 0,
          ytdMonth: ytdMonth ? ytdMonth : 0,
          type: 0,
          glPayrollEntities: fEntities ? fEntities : [],
          isUtilizingEntities: 0,
          utilEntities: uEntities ? uEntities : [],
          method: 0,
          options: [0, 0]
        };
        setConfigForm(configForm);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [setLoading]);

  //Set Filtered Entity Trees when entities are loaded
  useEffect(() => {
    const runEntityTreeChildren = glPayrollEntities.map((entity) => {
      return { key: entity.entityId.toString(), title: entity.description, value: entity.entityId.toString() };
    });
    const rootNode = runEntityTreeChildren.find((x) => x.key === '0');
    const runEntityTree = [
      {
        key: rootNode ? rootNode.key : '0',
        title: rootNode ? rootNode.title : 'All Entities',
        value: rootNode ? rootNode.value : '0',
        children: runEntityTreeChildren.filter((x) => x.key !== '0' && x.title !== '')
      }
    ];
    setEntityTreeData(runEntityTree);
  }, [glPayrollEntities]);

  //Set Utilization Entity Trees when entities are loaded
  useEffect(() => {
    const runUtilEntityTreeChildren = utilEntities.map((entity) => {
      return { key: entity.entityId.toString(), title: entity.description, value: entity.entityId.toString() };
    });
    const rootNode = runUtilEntityTreeChildren.find((x) => x.key === '0');
    const runUtilEntityTree = [
      {
        key: rootNode ? rootNode.key : '0',
        title: rootNode ? rootNode.title : 'All Entities',
        value: rootNode ? rootNode.value : '0',
        children: runUtilEntityTreeChildren.filter((x) => x.key !== '0' && x.title !== '')
      }
    ];
    setUtilEntityTreeData(runUtilEntityTree);
  }, [utilEntities]);

  //Form Finish
  const onFormFinish = async (vals: { [name: string]: any }) => {
    const values = vals as IConfigForm;
    const newConfig = {
      costingConfigGuid: getEmptyGuid(),
      name: values.name,
      description: values.description,
      isGLCosting: true,
      defaultChargeAllocationMethod: values.method,
      fiscalYearId: values.year,
      fiscalMonthId: values.ytdMonth,
      type: values.type ? values.type : 0,
      isPayrollCosting: values.options ? values.options.indexOf(2) >= 0 : false,
      isBudgetedAndActualCosting: values.options ? values.options.indexOf(1) >= 0 : false,
      isUtilizationEntityConfigured: values.isUtilizingEntities ? (values.isUtilizingEntities === 1 ? true : false) : false,
      createdAt: new Date(),
      modifiedAtUtc: new Date(),
      lastPublishedUtc: new Date(),
      isEditable: true,
      glPayrollEntities: [],
      utilEntities: []
    };

    const glPayrollEntities = values.glPayrollEntities ? values.glPayrollEntities.map((x) => +x) : [];
    const utilEntities = values.utilEntities ? values.utilEntities.map((x) => +x) : [];
    const configSaveData: ICostConfigSaveData = {
      costingConfig: newConfig,
      glPayrollEntities: glPayrollEntities,
      utilEntities: utilEntities
    };

    try {
      setLoading(true);
      const saveConfigResult = await costConfigService.addNewConfig(configSaveData);

      if (saveConfigResult.success) {
        Toast.show({ message: saveConfigResult.message, toastType: 'success' });
        //reset form
        form.resetFields();
        setCostingType(0);
        setEntityUtilType(0);
        props.onAddConfig(saveConfigResult.costingConfig);
        props.onSave();
      } else {
        Toast.show({ message: saveConfigResult.message, toastType: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCostingType(0);
    setEntityUtilType(0);
    props.onCancel();
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

  return (
    <>
      <Modal
        title='New Model'
        visible={props.visible}
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
        <Form form={form} onFinish={onFormFinish} layout={'vertical'} preserve={true} initialValues={configForm}>
          <Form.Item label='Name' name='name' rules={[{ required: true, whitespace: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Description' name='description'>
            <InputTextArea />
          </Form.Item>
          <Spacing itemSpacing={16}>
            <Form.Item label='Year' name='year' rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalYearId' itemTextField='name' items={fiscalYears} />
            </Form.Item>
            <Form.Item label='YTD Month' name='ytdMonth' rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalMonthId' itemTextField='name' items={fiscalMonths} />
            </Form.Item>
          </Spacing>
          <Spacing itemSpacing={16}>
            {isClaimsCostingEnabled && (
              <Form.Item label='Type' name='type' rules={[{ required: true }]}>
                <RadioGroup
                  onChange={handleCostingTypeChange}
                  options={costingTypes.map((costingType, index) => {
                    return { value: index, label: costingType.friendlyName };
                  })}
                />
              </Form.Item>
            )}
            <Form.Item label='GL/Payroll Entities' name='glPayrollEntities' rules={[{ required: true }]}>
              <TreeDropDown treeData={entityTreeData} selectionMode='multiple' treeDefaultExpandedKeys={['0']} />
            </Form.Item>
          </Spacing>
          {isCostingEntityLevelSecurityEnabled && (
            <Spacing itemSpacing={16}>
              <Form.Item label='Utilization Entities' name='isUtilizingEntities' rules={[{ required: true }]}>
                <RadioGroup
                  onChange={handleEntityTypeChange}
                  options={[
                    { value: 0, label: 'Same as GL/Payroll' },
                    { value: 1, label: 'Specify' }
                  ]}
                />
              </Form.Item>
              {entityUtilType === 1 && (
                <Form.Item label='Specifiy Utilization Entities' name='utilEntities' rules={[{ required: true }]}>
                  <TreeDropDown treeData={utilEntityTreeData} selectionMode='multiple' treeDefaultExpandedKeys={['0']} />
                </Form.Item>
              )}
            </Spacing>
          )}
          {costingType === 0 && (
            <Spacing itemSpacing={16}>
              <Form.Item label='Method' name='method' rules={[{ required: true }]}>
                <RadioGroup
                  options={costingMethods.map((costingMethod, index) => {
                    return { value: index, label: costingMethod.friendlyName };
                  })}
                />
              </Form.Item>
              <Form.Item label='Additional Data' name='options' rules={[{ required: false }]}>
                <CheckboxGroup
                  options={[
                    { value: 1, label: 'Include Budget' },
                    { value: 2, label: 'Include Payroll' }
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

export default CostingConfigModal;
