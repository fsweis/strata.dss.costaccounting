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
import { costConfigService } from '../shared/data/costConfigService';
import { systemSettingService } from '../shared/data/systemSettingService';
import { dateService } from '../shared/data/dateService';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { ICostConfigSaveData } from './data/ICostConfigSaveData';
import { ICostingConfigForm } from './data/ICostingConfigForm';
import TreeDropDown, { ITreeDropDownNode } from '@strata/tempo/lib/treedropdown';
import { ICostConfig } from '../shared/data/ICostConfig';
import { getEmptyGuid } from '../shared/Utils';
import { Simultaneous_FriendlyName, SingleStepDown_FriendlyName } from './constants/CostingMethodConstants';
import { PatientCare_FriendlyName, Claims_FriendlyName } from './constants/CostingTypeConstants';
import { CostingMethod } from './enums/CostingMethodEnum';
import { CostingType } from '../shared/enums/CostingTypeEnum';
import { EntityType } from './enums/EntityTypeEnum';

interface ICostingConfigConfigureModalProps {
  visible: boolean;
  costingConfigForm: ICostingConfigForm;
  costConfigs: ICostConfig[];
  onCancel: () => void;
  onSave: (costingConfig: ICostConfig) => void;
}

const CostingConfigConfigureModal: React.FC<ICostingConfigConfigureModalProps> = (props: ICostingConfigConfigureModalProps) => {
  const [form] = Form.useForm();
  const [fiscalYears, setFiscalYears] = useState<IFiscalYear[]>([]);
  const [fiscalMonths, setFiscalMonths] = useState<IFiscalMonth[]>([]);
  const [utilEntities, setUtilEntities] = useState<IEntity[]>([]);
  const [glPayrollEntities, setGlPayrollEntities] = useState<IEntity[]>([]);
  const { setLoading } = usePageLoader();
  const [costingType, setCostingType] = useState<number>(0);
  const [entityUtilType, setEntityUtilType] = useState<number>(0);
  const [entityTreeData, setEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [utilEntityTreeData, setUtilEntityTreeData] = useState<ITreeDropDownNode[]>([]);
  const [isClaimsCostingEnabled, setIsClaimsCostingEnabled] = useState<boolean>(false);
  const [isCostingEntityLevelSecurityEnabled, setIsCostingEntityLevelSecurityEnabled] = useState<boolean>(false);
  const [costingConfigForm, setcostingConfigForm] = useState<ICostingConfigForm>();
  const emptyGuid = getEmptyGuid();
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

        const [fiscalMonths, fiscalYears, glPayrollEntities, utilEntities] = await Promise.all([
          dateService.getFiscalMonths(),
          dateService.getFiscalYears(),
          costConfigService.getGlPayrollEntities(emptyGuid),
          isCostingEntityLevelSecurityEnabled ? costConfigService.getUtilEntities() : []
        ]);
        setFiscalMonths(fiscalMonths);
        setFiscalYears(fiscalYears);
        setGlPayrollEntities(glPayrollEntities);
        setUtilEntities(utilEntities);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [setLoading, emptyGuid]);

  // useEffect(() => {
  //   //set initial form
  //   const year = fiscalYears.find((x) => x.fiscalYearId === new Date().getFullYear())?.fiscalYearId;
  //   const ytdMonth = fiscalMonths.find((x) => x.sortOrder === 12)?.fiscalMonthId;
  //   const fEntities = glPayrollEntities.map((x) => x.entityId.toString());
  //   const uEntities = utilEntities.map((x) => x.entityId.toString());
  //   const configForm = {
  //     name: '',
  //     description: '',
  //     year: year ? year : 0,
  //     ytdMonth: ytdMonth ? ytdMonth : 0,
  //     type: CostingType.PatientCare,
  //     glPayrollEntities: fEntities.length > 0 ? fEntities : ['0'],
  //     entityType: EntityType.GlPayroll,
  //     utilEntities: uEntities.length > 0 ? uEntities : ['0'],
  //     defaultMethod: CostingMethod.Simultaneous,
  //     options: [0, 0]
  //   };

  //   if (props.copyCostConfigGuid !== '') {
  //     const fetchModel = async () => {
  //       const costModel = await costConfigService.getCostConfigForCopy(props.copyCostConfigGuid);
  //       configForm.name = costModel.name + ' - Copy';
  //       configForm.description = costModel.description;
  //       configForm.year = costModel.fiscalYearId;
  //       configForm.type = costModel.type;
  //       configForm.ytdMonth = costModel.fiscalMonthId;
  //       configForm.options = [costModel.isBudgetedAndActualCosting ? 1 : 0, costModel.isPayrollCosting ? 2 : 0];
  //       configForm.glPayrollEntities = costModel.glPayrollEntities;
  //       configForm.utilEntities = costModel.utilEntities;
  //       configForm.defaultMethod = costModel.defaultMethod;

  //       setConfigForm(configForm);
  //       form.resetFields();
  //     };
  //     fetchModel();
  //     setTitle('Copy Model');
  //   } else {
  //     setConfigForm(configForm);
  //     form.resetFields();
  //     setTitle('New Model');
  //   }
  // }, [props.copyCostConfigGuid]);

  //Set Filtered Entity Trees when entities are loaded
  useEffect(() => {
    const glPayrollEntityTree = getEntityTree(glPayrollEntities);
    setEntityTreeData(glPayrollEntityTree);
  }, [glPayrollEntities]);

  //Set Utilization Entity Trees when entities are loaded
  useEffect(() => {
    const utilEntityTree = getEntityTree(utilEntities);
    setUtilEntityTreeData(utilEntityTree);
  }, [utilEntities]);

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
    if (props.costConfigs.find((x) => x.name.toLowerCase() === cleanedName.toLowerCase()) !== undefined) {
      Toast.show({ message: 'Duplicate names are not allowed.', toastType: 'info' });
    } else {
      //Create new cost model
      const newConfig: ICostConfig = {
        costingConfigGuid: emptyGuid,
        name: cleanedName,
        description: values.description,
        isGLCosting: true,
        defaultChargeAllocationMethod: 0,
        defaultMethod: values.defaultMethod,
        fiscalYearId: values.year,
        fiscalMonthId: values.ytdMonth,
        type: values.type,
        isPayrollCosting: values.type === CostingType.PatientCare ? values.options.includes(2) : false,
        isBudgetedAndActualCosting: values.type === CostingType.PatientCare ? values.options.includes(1) : false,
        isUtilizationEntityConfigured: values.entityType === EntityType.Specify,
        createdAt: new Date(),
        modifiedAtUtc: new Date(),
        lastPublishedUtc: new Date(),
        isEditable: true,
        glPayrollEntities: [],
        utilEntities: []
      };

      const configSaveData: ICostConfigSaveData = {
        costingConfig: newConfig,
        glPayrollEntities: values.glPayrollEntities.map((x) => +x),
        utilEntities: values.type === CostingType.PatientCare && values.entityType === EntityType.Specify ? values.utilEntities.map((x) => +x) : []
      };

      try {
        setLoading(true);
        const newConfig = await costConfigService.addNewConfig(configSaveData);
        Toast.show({ message: 'Changes Saved', toastType: 'success' });
        //reset form
        form.resetFields();
        setCostingType(0);
        setEntityUtilType(0);
        //props.onSave(newConfig);
      } catch (error) {
        Toast.show({ message: 'Changes not saved. Try again and contact your administrator if the issue continues.', toastType: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCostingType(0);
    setEntityUtilType(0);
    Toast.show({ message: 'Changes Discarded', toastType: 'info' });
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

  const getYearInitialValue = () => {
    if (props.costingConfigForm.isCopy) return props.costingConfigForm.year;

    const year = fiscalYears.find((x) => x.fiscalYearId === new Date().getFullYear())?.fiscalYearId;
    return year ? year : 0;
  };

  const getMonthInitialValue = () => {
    if (props.costingConfigForm.isCopy) return props.costingConfigForm.ytdMonth;

    const ytdMonth = fiscalMonths.find((x) => x.sortOrder === 12)?.fiscalMonthId;
    return ytdMonth ? ytdMonth : 0;
  };

  const getGlPayrollEntitiesInitialValue = () => {
    if (props.costingConfigForm.isCopy) return props.costingConfigForm.glPayrollEntities;

    const fEntities = glPayrollEntities.map((x) => x.entityId.toString());
    return fEntities.length > 0 ? fEntities : ['0'];
  };

  const getUtilEntitiesInitialValue = () => {
    if (props.costingConfigForm.isCopy) return props.costingConfigForm.utilEntities;

    const uEntities = utilEntities.map((x) => x.entityId.toString());
    return uEntities.length > 0 ? uEntities : ['0'];
  };

  return (
    <>
      <Modal
        title={title}
        visible={props.visible}
        // destroyOnClose
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
        <Form form={form} onFinish={onFormFinish} layout={'vertical'} preserve={true} initialValues={costingConfigForm}>
          <Form.Item label='Name' name='name' initialValue={props.costingConfigForm.name} rules={[{ required: true, whitespace: true, max: 50 }, { pattern: /^[A-Za-z0-9 _-]*$/ }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Description' name='description' initialValue={props.costingConfigForm.description} rules={[{ max: 2000 }]}>
            <InputTextArea />
          </Form.Item>
          <Spacing itemSpacing={16}>
            <Form.Item label='Year' name='year' initialValue={getYearInitialValue} rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalYearId' itemTextField='name' items={fiscalYears} />
            </Form.Item>
            <Form.Item label='YTD Month' name='ytdMonth' initialValue={getMonthInitialValue} rules={[{ required: true }]}>
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
            <Form.Item label='GL/Payroll Entities' name='glPayrollEntities' initialValue={getGlPayrollEntitiesInitialValue} rules={[{ required: true }]}>
              <TreeDropDown treeData={entityTreeData} selectionMode='multiple' treeDefaultExpandedKeys={['0']} />
            </Form.Item>
          </Spacing>
          {isCostingEntityLevelSecurityEnabled && (
            <Spacing itemSpacing={16}>
              <Form.Item label='Utilization Entities' name='entityType' initialValue={getUtilEntitiesInitialValue} rules={[{ required: true }]}>
                <RadioGroup
                  onChange={handleEntityTypeChange}
                  options={[
                    { value: EntityType.GlPayroll, label: 'Same as GL/Payroll' },
                    { value: EntityType.Specify, label: 'Specify' }
                  ]}
                />
              </Form.Item>
              {entityUtilType === EntityType.Specify && (
                <Form.Item label='Specifiy Utilization Entities' name='utilEntities' initialValue={props.costingConfigForm.utilEntities} rules={[{ required: true }]}>
                  <TreeDropDown treeData={utilEntityTreeData} selectionMode='multiple' treeDefaultExpandedKeys={['0']} />
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

export default CostingConfigConfigureModal;
