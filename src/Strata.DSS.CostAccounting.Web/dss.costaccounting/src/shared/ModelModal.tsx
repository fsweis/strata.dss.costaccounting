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
import { costConfigService } from './data/CostConfigService';

export interface IModelModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const ModelModal: React.FC<IModelModalProps> = (props: IModelModalProps) => {
  const [form] = Form.useForm();
  const [fiscalYears, setFiscalYears] = useState<IFiscalYear[]>([]);
  const [fiscalMonths, setFiscalMonths] = useState<IFiscalMonth[]>([]);
  const { setLoading } = usePageLoader();

  useEffect(() => {
    const fetchData = async () => {
      try {
        ///  const [fiscalMonths, fiscalYears] = await Promise.all([costConfigService.getFiscalMonths(), costConfigService.getFiscalYears()]);
        //  setFiscalMonths(fiscalMonths);
        //   setFiscalYears(fiscalYears);
      } finally {
        // setGridLoading(false);
      }
    };
    //  setGridLoading(true);
    fetchData();
  }, []);

  const onFormFinish = async (vals: { [name: string]: any }) => {
    console.log(vals);
    //const values = vals as ICostingConfig;
    // setLoading(true);
    // setIsVisible(false);
    // setShowForm(false);
    form.resetFields();
  };

  const handleCancel = () => {
    props.onCancel();
  };

  const handleSave = () => {
    props.onSave();
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
              <DropDown itemValueField='fiscalYearID' itemTextField='name' items={fiscalYears} />
            </Form.Item>
            <Form.Item label='YTD Month' name='ytdMonth' rules={[{ required: true }]}>
              <DropDown itemValueField='fiscalMonthID' itemTextField='name' items={fiscalMonths} />
            </Form.Item>
          </Spacing>
          <Spacing itemSpacing={16}>
            <Form.Item label='Type' name='type' rules={[{ required: true }]}>
              <RadioGroup
                options={[
                  { value: '1', label: 'Patient Care' },
                  { value: '2', label: 'Claims' }
                ]}
              />
            </Form.Item>
            <Form.Item label='GL/Payroll Entities' name='entities' rules={[{ required: true }]}>
              <DropDown>
                <DropDown.Item value='1'>Entity A</DropDown.Item>
                <DropDown.Item value='2'>Entity B</DropDown.Item>
                <DropDown.Item value='3'>Entity C</DropDown.Item>
                <DropDown.Item value='4'>Entity D</DropDown.Item>
              </DropDown>
            </Form.Item>
          </Spacing>
          <Spacing itemSpacing={16}>
            <Form.Item label='Utilization Entities' name='utilizationEntities' rules={[{ required: true }]}>
              <RadioGroup
                options={[
                  { value: '1', label: 'Same as GL/Payroll' },
                  { value: '2', label: 'Specify' }
                ]}
              />
            </Form.Item>
            <Form.Item label='Specifiy Utilization Entities' name='specifyUtilizationEntities' rules={[{ required: true }]}>
              <DropDown>
                <DropDown.Item value='1'>Entity A</DropDown.Item>
                <DropDown.Item value='2'>Entity B</DropDown.Item>
                <DropDown.Item value='3'>Entity C</DropDown.Item>
                <DropDown.Item value='4'>Entity D</DropDown.Item>
              </DropDown>
            </Form.Item>
          </Spacing>
          <Spacing itemSpacing={16}>
            <Form.Item label='Method' name='method' rules={[{ required: true }]}>
              <RadioGroup
                options={[
                  { value: '1', label: 'Simultaneous' },
                  { value: '2', label: 'One Level Step Down' }
                ]}
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
        </Form>
      </Modal>
    </>
  );
};

export default ModelModal;
