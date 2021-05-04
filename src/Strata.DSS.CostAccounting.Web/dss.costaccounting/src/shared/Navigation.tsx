import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@strata/tempo/lib/header';
import Tabs from '@strata/tempo/lib/tabs';
import Layout from '@strata/tempo/lib/layout';
import { Switch, Route } from 'react-router-dom';
import ExampleUser from '../user-example/ExampleUser';
import ExampleDatabase from '../database-example/ExampleDatabase';
import { InternalNavbar } from '@strata/navbar/lib';

const Navigation: React.FC = () => {
  const location = useLocation();

  const getActiveUrlKey = () => {
    if (location.pathname === '/') {
      return '/users';
    }

    return location.pathname;
  };

  return (
    <>
      <Layout>
        <Layout.Nav>
          <InternalNavbar />
        </Layout.Nav>
        <Layout.Content>
          <Header title='Strata CostAccounting'></Header>
          <Tabs activeKey={getActiveUrlKey()}>
            <Tabs.TabPane key='/users' tab='Users' href='/users' />
            <Tabs.TabPane key='/databases' tab='Databases' href='/databases' />
          </Tabs>
          <Switch>
            <Route path={['/', '/users']} exact component={ExampleUser} key='users'></Route>
            <Route path='/databases' exact component={ExampleDatabase} key='databases'></Route>
          </Switch>
        </Layout.Content>
      </Layout>
    </>
  );
};

export default Navigation;
