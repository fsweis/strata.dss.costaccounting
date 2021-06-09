import React from 'react';
import Modal from '@strata/tempo/lib/modal';
import Input from '@strata/tempo/lib/input';
import useForm, { RuleObject } from '@strata/tempo/lib/form';
import Button from '@strata/tempo/lib/button';
import Form from '@strata/tempo/lib/form';
import InputTextArea from '@strata/tempo/lib/inputtextarea';
import RadioGroup from '@strata/tempo/lib/radiogroup';
import CheckboxGroup from '@strata/tempo/lib/checkboxgroup';
import { useEffect, useState, ChangeEvent } from 'react';
import Spacing from '@strata/tempo/lib/spacing';
import DropDown, { DropDownValue } from '@strata/tempo/lib/dropdown';
import Text from '@strata/tempo/lib/text';
import { usePageLoader } from '@strata/tempo/lib/pageloader';
import { IFiscalYear } from './data/IFiscalYear';
import { IFiscalMonth } from './data/IFiscalMonth';
import { IEntity } from './data/IEntity';
import { costConfigService } from './data/CostConfigService';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { ICostingType } from './data/ICostingType';
import { ICostingMethod } from './data/ICostingMethod';

export interface IModelModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const ModelModal: React.FC<IModelModalProps> = (props: IModelModalProps) => {
  const [form] = Form.useForm();
  const [fiscalYears, setFiscalYears] = useState<IFiscalYear[]>([]);
  const [fiscalMonths, setFiscalMonths] = useState<IFiscalMonth[]>([]);
  const [entities, setEntities] = useState<IEntity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<IEntity[]>([]);
  const { setLoading } = usePageLoader();
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [costingType, setCostingType] = useState<number>(0);
  const [entityUtilType, setEntityUtilType] = useState<number>(0);
  const [costingTypes, setCostingTypes] = useState<ICostingType[]>([]);
  const [costingMethods, setCostingMethods] = useState<ICostingMethod[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fiscalMonths, fiscalYears, entities, filteredEntities, costingTypes, costingMethods] = await Promise.all([
          costConfigService.getFiscalMonths(),
          costConfigService.getFiscalYears(),
          costConfigService.getEntities(),
          costConfigService.getFilteredEntities(),
          costConfigService.getCostingTypes(),
          costConfigService.getCostingMethods()
        ]);
        setFiscalMonths(fiscalMonths);
        setFiscalYears(fiscalYears);
        setEntities(entities);
        setFilteredEntities(filteredEntities);
        setCostingTypes(costingTypes);
        setCostingMethods(costingMethods);
      } finally {
        setModalLoading(false);
      }
    };
    setModalLoading(true);
    fetchData();
  }, []);

  const onFormFinish = async (vals: { [name: string]: any }) => {
    console.log(vals);
    //const values = vals as ICostingConfig;
    form.resetFields();
  };

  const handleCancel = () => {
    props.onCancel();
  };

  const handleSave = () => {
    props.onSave();
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
            <Button type='tertiary' icon='InfoCircle' />
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type='primary' htmlType='submit' onClick={handleSave}>
              Save
            </Button>
          </>
        }
      >
        <Form form={form} onFinish={onFormFinish} layout={'vertical'} preserve={false}>
          <Form.Item label='Name' name='name' rules={[{ required: true, whitespace: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Description' name='description'>
            <InputTextArea />
          </Form.Item>
          <Spacing itemSpacing={16}>
            <Form.Item label='Year' name='year' rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalYearID' itemTextField='name' items={fiscalYears} defaultValue={fiscalYears.find((x) => x.fiscalYearID === new Date().getFullYear())?.fiscalYearID} />
            </Form.Item>
            <Form.Item label='YTD Month' name='ytdMonth' rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalMonthID' itemTextField='name' items={fiscalMonths} defaultValue={fiscalMonths.find((x) => x.sortOrder === 12)?.fiscalMonthID} />
            </Form.Item>
          </Spacing>
          <Spacing itemSpacing={16}>
            <Form.Item label='Type' name='type' rules={[{ required: true }]}>
              <RadioGroup
                defaultValue={0}
                onChange={handleCostingTypeChange}
                options={costingTypes.map((costingType, index) => {
                  return { value: index, label: costingType.friendlyName };
                })}
              />
            </Form.Item>
            <Form.Item label='GL/Payroll Entities' name='entities' rules={[{ required: true }]}>
              <DropDown multiSelect itemValueField='entityID' itemTextField='description' items={filteredEntities} defaultValue={filteredEntities.find((x) => x.entityID === 0)?.entityID} />
            </Form.Item>
          </Spacing>
          <Spacing itemSpacing={16}>
            <Form.Item label='Utilization Entities' name='utilizationEntities' rules={[{ required: true }]}>
              <RadioGroup
                defaultValue={0}
                onChange={handleEntityTypeChange}
                options={[
                  { value: 0, label: 'Same as GL/Payroll' },
                  { value: 1, label: 'Specify' }
                ]}
              />
            </Form.Item>
            {entityUtilType === 1 && (
              <Form.Item label='Specifiy Utilization Entities' name='specifyUtilizationEntities' rules={[{ required: true }]}>
                <DropDown multiSelect itemValueField='entityID' itemTextField='description' items={entities} defaultValue={filteredEntities.find((x) => x.entityID === 0)?.entityID} />
              </Form.Item>
            )}
          </Spacing>
          {costingType === 0 && (
            <Spacing itemSpacing={16}>
              <Form.Item label='Method' name='method' rules={[{ required: true }]}>
                <RadioGroup
                  defaultValue={0}
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
