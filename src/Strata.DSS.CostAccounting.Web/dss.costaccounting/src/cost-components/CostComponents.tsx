import React from 'react';
import Header from '@strata/tempo/lib/header';
import CostComponentsMappings from './CostComponentsMappings';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import Button from '@strata/tempo/lib/button';
import Tabs from '@strata/tempo/lib/tabs';

const CostComponents: React.FC = () => {
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
          <CostComponentsMappings></CostComponentsMappings>
        </Tabs.TabPane>
        <Tabs.TabPane key='2' tab='Account Overrides'></Tabs.TabPane>
        <Tabs.TabPane key='3' tab='Payroll Overrides'></Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default CostComponents;
