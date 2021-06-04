import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@strata/tempo/lib/header';
import Layout from '@strata/tempo/lib/layout';
import Menu from '@strata/tempo/lib/menu';
import { Switch, Route } from 'react-router-dom';
import StatisticDrivers from '../statistic-driver/StatisticDrivers';
import { Navbar } from '@strata/navbar/lib';

const Navigation: React.FC = () => {
  const location = useLocation();

  const getActiveUrlKey = () => {
    if (location.pathname === '/') {
      return ['/statistic-drivers'];
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
              <Menu.ItemGroup title='CATEGORIZE'>
                <Menu.Item key='/statistic-drivers' href='/statistic-drivers'>
                  Statistic Drivers
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu>
          </Layout.Sider>
          <Layout.Content>
            <Switch>
              <Route path={['/', '/statistic-drivers']} exact component={StatisticDrivers} key='statistic-drivers'></Route>
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Navigation;
