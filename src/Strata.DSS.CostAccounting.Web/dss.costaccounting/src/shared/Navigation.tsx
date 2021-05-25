import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@strata/tempo/lib/header';
import Layout from '@strata/tempo/lib/layout';
import Menu from '@strata/tempo/lib/menu';
import { Switch, Route } from 'react-router-dom';
import ExampleUser from '../user-example/ExampleUser';
import ExampleDatabase from '../database-example/ExampleDatabase';
import StatisticDrivers from '../statisticdrivers/StatisticDrivers';
import { Navbar } from '@strata/navbar/lib';

const Navigation: React.FC = () => {
  const location = useLocation();

  const getActiveUrlKey = () => {
    if (location.pathname === '/') {
      return ['/users'];
    }

    return [location.pathname];
  };

  return (
    <>
      <Layout>
        <Layout.Nav>
          <Navbar />
        </Layout.Nav>
        <Layout>
          <Layout.Sider collapsible>
            <Header title='Cost Accounting' />
            <Menu selectedKeys={getActiveUrlKey()}>
              <Menu.ItemGroup title=''>
                <Menu.Item key='/users' href='/users'>
                  Overview
                </Menu.Item>
                <Menu.Item key='/databases' href='/databases'>
                  Cost Audit
                </Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title='CATEGORIZE'>
                <Menu.Item key='/users' href='/users'>
                  Department Categorization
                </Menu.Item>
                <Menu.Item key='/databases' href='/databases'>
                  Cost Components
                </Menu.Item>
                <Menu.Item key='/databases' href='/databases'>
                  Variability
                </Menu.Item>
                <Menu.Item key='/databases' href='/databases'>
                  Statistics Drivers
                </Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title='ALIGN'>
                <Menu.Item key='/users' href='/users'>
                  Reclassification
                </Menu.Item>
                <Menu.Item key='/databases' href='/databases'>
                  Overhead Allocation
                </Menu.Item>
                <Menu.Item key='/databases' href='/databases'>
                  Variability
                </Menu.Item>
                <Menu.Item key='/databases' href='/databases'>
                  Statistics Drivers
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu>
          </Layout.Sider>
          <Layout.Content>
            <Switch>
              <Route path={['/', '/users']} exact component={ExampleUser} key='users'></Route>
              <Route path='/databases' exact component={ExampleDatabase} key='databases'></Route>
              <Route path='/statistic-drivers' exact component={StatisticDrivers} key='statistic-drivers'></Route>
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Navigation;
