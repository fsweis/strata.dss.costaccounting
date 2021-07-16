import React from 'react';
import Header from '@strata/tempo/lib/header';
import Button from '@strata/tempo/lib/button';
import Tabs from '@strata/tempo/lib/tabs';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import FilteredDepartments from './FilteredDepartments';
import DepartmentExceptions from './DepartmentExceptions';
import { DepartmentTypeEnum } from './enums/DepartmentTypeEnum';
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router';

const DepartmentCategorization: React.FC = () => {
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
        title='Department Categorization'
        extra={
          <>
            <ButtonMenu
              buttonText='Reports'
              type='tertiary'
              onClick={() => {
                return;
              }}
            >
              <ButtonMenu.Item key='1'>Department Categorization Report</ButtonMenu.Item>
            </ButtonMenu>

            <Button type='tertiary' icon='InfoCircle' />
          </>
        }
      />
      <Tabs activeKey={getActiveTab()}>
        <Tabs.TabPane key='exceptions' tab='Exceptions' href={`${url}/exceptions`} />
        <Tabs.TabPane key='overhead' tab='Overhead' href={`${url}/overhead`} />
        <Tabs.TabPane key='revenue' tab='Revenue' href={`${url}/revenue`} />
      </Tabs>
      <Switch>
        <Route path={path} exact render={() => <Redirect to={`${url}/exceptions`}></Redirect>} key='default'></Route>
        <Route path={`${path}/exceptions`} render={() => <DepartmentExceptions></DepartmentExceptions>} key='exceptions'></Route>
        <Route path={`${path}/overhead`} render={() => <FilteredDepartments departmentType={DepartmentTypeEnum.Overhead}></FilteredDepartments>} key='overhead'></Route>
        <Route path={`${path}/revenue`} render={() => <FilteredDepartments departmentType={DepartmentTypeEnum.Revenue}></FilteredDepartments>} key='revenue'></Route>
      </Switch>
    </>
  );
};

export default DepartmentCategorization;
