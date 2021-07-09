import React from 'react';
import Header from '@strata/tempo/lib/header';
import CostComponentsMappings from './CostComponentsMappings';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import Button from '@strata/tempo/lib/button';
import Tabs from '@strata/tempo/lib/tabs';
import { useContext } from 'react';
import { CostingConfigContext } from '../shared/data/CostingConfigContext';

const CostComponents: React.FC = () => {
  const { costingConfig } = useContext(CostingConfigContext);

  return (
    <>
      <Header
        title='Cost Components'
        extra={
          <>
            <ButtonMenu
              buttonText='Reports'
              type='tertiary'
              onClick={() => {
                return;
              }}
            >
              <ButtonMenu.Item key='1'>Cost Component Report</ButtonMenu.Item>
            </ButtonMenu>
            <Button type='tertiary' icon='InfoCircle' />
          </>
        }
      />
      <Tabs defaultActiveKey='1'>
        <Tabs.TabPane key='1' tab='Mappings'>
          <CostComponentsMappings costingConfig={costingConfig}></CostComponentsMappings>
        </Tabs.TabPane>
        <Tabs.TabPane key='2' tab='Account Overrides'></Tabs.TabPane>
        <Tabs.TabPane key='3' tab='Payroll Overrides'></Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default CostComponents;
