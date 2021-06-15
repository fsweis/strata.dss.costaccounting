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
import { IEntity } from '../shared/data/IEntity';
import { costConfigService } from '../shared/data/costConfigService';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { ICostingType } from './data/ICostingType';
import { ICostingMethod } from './data/ICostingMethod';
import { ICostingPermissions } from './data/ICostingPermissions';
import { ICostConfigSaveData } from './data/ICostConfigSaveData';
import TreeDropDown, { ITreeDropDownNode } from '@strata/tempo/lib/treedropdown';
import { getEmptyGuid } from '../shared/Utils';
import { config } from 'process';
import { ICostConfig } from '../shared/data/ICostConfig';

export interface IModelModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  costingConfigGuid: string;
}

export interface IConfigForm {
  name: string;
  description: string;
  year: number;
  ytdMonth: number;
  type: number;
  filteredEntities: number[];
  utilizationEntities: number;
  specifyUtilizationEntities: number[];
  method: number;
  options: number[];
}

const ModelModal: React.FC<IModelModalProps> = (props: IModelModalProps) => {
  const [form] = Form.useForm();
  const [fiscalYears, setFiscalYears] = useState<IFiscalYear[]>([]);
  const [fiscalMonths, setFiscalMonths] = useState<IFiscalMonth[]>([]);
  const [entities, setEntities] = useState<IEntity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<IEntity[]>([]);
  const { setLoading } = usePageLoader();
  const [costingType, setCostingType] = useState<number>(0);
  const [entityUtilType, setEntityUtilType] = useState<number>(0);
  const [costingTypes, setCostingTypes] = useState<ICostingType[]>([]);
  const [costingMethods, setCostingMethods] = useState<ICostingMethod[]>([]);
  const [entityTreeData, setEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [utilEntityTreeData, setUtilEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [costingPermissions, setCostingPermissions] = useState<ICostingPermissions>();
  const [configForm, setConfigForm] = useState<IConfigForm>();
  const [title, setTitle] = useState<string>('');
  //Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fiscalMonths, fiscalYears, entities, filteredEntities, costingTypes, costingMethods, costingPermissions] = await Promise.all([
          costConfigService.getFiscalMonths(),
          costConfigService.getFiscalYears(),
          costConfigService.getEntities(),
          costConfigService.getFilteredEntities(),
          costConfigService.getCostingTypes(),
          costConfigService.getCostingMethods(),
          costConfigService.getCostingPermissions()
        ]);
        setFiscalMonths(fiscalMonths);
        setFiscalYears(fiscalYears);
        setEntities(entities);
        setFilteredEntities(filteredEntities);
        setCostingTypes(costingTypes);
        setCostingMethods(costingMethods);
        setCostingPermissions(costingPermissions);

        const year = fiscalYears.find((x) => x.fiscalYearID === new Date().getFullYear())?.fiscalYearID;
        const ytdMonth = fiscalMonths.find((x) => x.sortOrder === 12)?.fiscalMonthID;
        const fEntities = filteredEntities.map((x) => x.entityID);
        const nEntities = entities.map((x) => x.entityID);

        const configForm = {
          name: '',
          description: '',
          year: year ? year : 0,
          ytdMonth: ytdMonth ? ytdMonth : 0,
          type: 0,
          filteredEntities: fEntities ? fEntities : [],
          utilizationEntities: 0,
          specifyUtilizationEntities: nEntities ? nEntities : [],
          method: 0,
          options: []
        };

        if (props.costingConfigGuid !== '') {
          const fetchModel = async () => {
            const costModel = await costConfigService.getCostConfigForCopy(props.costingConfigGuid);

            configForm.name = costModel.name + ' - Copy';
            configForm.description = costModel.description;
            configForm.year = costModel.fiscalYearID;
            configForm.type = costModel.type;
            configForm.ytdMonth = costModel.fiscalMonthId;
            //TODO: I do not think the ones below are mapped correctly?
            configForm.filteredEntities = costModel.glPayrollEntities;
            configForm.specifyUtilizationEntities = costModel.utilEntities;
            configForm.method = costModel.defaultChargeAllocationMethod;
            setConfigForm(configForm);
          };
          fetchModel();

          setTitle('Copy Model');
        } else {
          setConfigForm(configForm);
          setTitle('New Model');
        }
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [props.costingConfigGuid]);

  //useEffect(() => {}, [props.costingConfigGuid]);

  //Set Filtered Entity Trees when entities are loaded
  useEffect(() => {
    const runEntityTreeChildren = filteredEntities.map((entity) => {
      return { key: entity.entityID.toString(), title: entity.description, value: entity.entityID.toString() };
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
  }, [filteredEntities]);

  //Set Utilization Entity Trees when entities are loaded
  useEffect(() => {
    const runUtilEntityTreeChildren = entities.map((entity) => {
      return { key: entity.entityID.toString(), title: entity.description, value: entity.entityID.toString() };
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
  }, [entities]);

  //Form Finish
  const onFormFinish = async (vals: { [name: string]: any }) => {
    const values = vals as IConfigForm;

    const glPayrollEntities = values.filteredEntities ? values.filteredEntities.map((x) => +x) : [];
    const utilEntities = values.specifyUtilizationEntities ? values.specifyUtilizationEntities.map((x) => +x) : [];

    const newConfig: ICostConfig = {
      costingConfigGuid: getEmptyGuid(),
      name: values.name,
      description: values.description,
      isGLCosting: true,
      defaultChargeAllocationMethod: values.method,
      fiscalYearID: values.year,
      fiscalMonthId: values.ytdMonth,
      type: values.type ? values.type : 0,
      isPayrollCosting: values.options ? values.options.indexOf(1) >= 0 : false,
      isBudgetedAndActualCosting: values.options ? values.options.indexOf(2) >= 0 : false,
      isUtilizationEntityConfigured: values.utilizationEntities ? (values.utilizationEntities === 1 ? true : false) : false,
      createdAt: new Date(),
      modifiedAtUtc: new Date(),
      lastPublishedUtc: new Date(),
      isEditable: true,
      glPayrollEntities: glPayrollEntities,
      utilEntities: utilEntities
    };

    try {
      setLoading(true);
      const saveConfigResult = await costConfigService.addNewConfig(newConfig as ICostConfig);

      if (saveConfigResult.success) {
        Toast.show({ message: saveConfigResult.message, toastType: 'success' });
        //reset form
        form.resetFields();
        setCostingType(0);
        setEntityUtilType(0);
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
        title={title}
        visible={props.visible}
        onCancel={handleCancel}
        onOk={handleSave}
        okText='Save'
        footer={
          <>
            <Button type='tertiary' icon='InfoCircle' />
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type='primary' htmlType='submit' onClick={handleSave}>
              Save
            </Button>
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
              <DropDown itemValueField='fiscalYearID' itemTextField='name' items={fiscalYears} />
            </Form.Item>
            <Form.Item label='YTD Month' name='ytdMonth' rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalMonthID' itemTextField='name' items={fiscalMonths} />
            </Form.Item>
          </Spacing>
          <Spacing itemSpacing={16}>
            {costingPermissions?.isClaimsCostingEnabled && (
              <Form.Item label='Type' name='type' rules={[{ required: true }]}>
                <RadioGroup
                  onChange={handleCostingTypeChange}
                  options={costingTypes.map((costingType, index) => {
                    return { value: index, label: costingType.friendlyName };
                  })}
                />
              </Form.Item>
            )}
            <Form.Item label='GL/Payroll Entities' name='filteredEntities' rules={[{ required: true }]}>
              <TreeDropDown treeData={entityTreeData} selectionMode='multiple' treeDefaultExpandedKeys={['0']} />
            </Form.Item>
          </Spacing>
          {costingPermissions?.isCostingEntityLevelSecurityEnabled && (
            <Spacing itemSpacing={16}>
              <Form.Item label='Utilization Entities' name='utilizationEntities' rules={[{ required: true }]}>
                <RadioGroup
                  onChange={handleEntityTypeChange}
                  options={[
                    { value: 0, label: 'Same as GL/Payroll' },
                    { value: 1, label: 'Specify' }
                  ]}
                />
              </Form.Item>
              {entityUtilType === 1 && (
                <Form.Item label='Specifiy Utilization Entities' name='specifyUtilizationEntities' rules={[{ required: true }]}>
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
              <Form.Item label='Options' name='options' rules={[{ required: false }]}>
                <CheckboxGroup
                  options={[
                    { value: '1', label: 'Include Budget' },
                    { value: '2', label: 'Include Payroll' }
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

export default ModelModal;
