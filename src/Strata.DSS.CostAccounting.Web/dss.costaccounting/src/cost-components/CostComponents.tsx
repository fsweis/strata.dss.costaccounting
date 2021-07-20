import React from 'react';
import Header from '@strata/tempo/lib/header';
import Mappings from './Mappings';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import Button from '@strata/tempo/lib/button';
import Tabs from '@strata/tempo/lib/tabs';
import AccountOverrides from './AccountOverrides';
import PayrollOverrides from './PayrollOverrides';
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router';

const CostComponents: React.FC = () => {
  const { path, url } = useRouteMatch();
  const location = useLocation();

  const getActiveTab = (): string => {
    const splitLocation = location.pathname.split('/');
    const currentLocation = splitLocation[splitLocation.length - 1];
    return currentLocation;
  };

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
      <Tabs activeKey={getActiveTab()}>
        <Tabs.TabPane key='mappings' tab='Mappings' href={`${url}/mappings`} />
        <Tabs.TabPane key='account-overrides' tab='Account Overrides' href={`${url}/account-overrides`} />
        <Tabs.TabPane key='payroll-overrides' tab='Payroll Overrides' href={`${url}/payroll-overrides`} />
      </Tabs>
      <Switch>
        <Route path={path} exact render={() => <Redirect to={`${url}/mappings`}></Redirect>} key='default'></Route>
        <Route path={`${path}/mappings`} key='mappings'>
          <Mappings />
        </Route>
        <Route path={`${path}/account-overrides`} key='account-overrides'>
          <AccountOverrides />
        </Route>
        <Route path={`${path}/payroll-overrides`} key='payroll-overrides'>
          <PayrollOverrides />
        </Route>
      </Switch>
    </>
  );
};

export default CostComponents;
