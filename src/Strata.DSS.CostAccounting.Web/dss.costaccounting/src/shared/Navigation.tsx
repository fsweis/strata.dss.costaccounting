import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@strata/tempo/lib/layout';
import Menu from '@strata/tempo/lib/menu';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import {} from '@strata/tempo/lib/buttonmenu';
import { Switch, Route } from 'react-router-dom';
import StatisticDrivers from '../statistic-driver/StatisticDrivers';
import Overview from '../overview/Overview';
import CostAudit from '../cost-audit/CostAudit';
import DepartmentCategorization from '../department-categorization/DepartmentCategorization';
import CostComponents from '../cost-components/CostComponents';
import Variability from '../variability/Variability';
import Reclassification from '../reclassification/Reclassification';
import OverheadAllocation from '../overhead-allocation/OverheadAllocation';
import CostComponentReclassification from '../cost-component-reclassification/CostComponentReclassification';
import ActivityCodeDesigner from '../activity-code-designer/ActivityCodeDesigner';
import ChargeAllocation from '../charge-allocation/ChargeAllocation';
import DropdownConfiguration from '../drop-down-configuration/DropdownConfiguration';
import ManualStatistics from '../manual-statistics/ManualStatistics';
import { costConfigService } from './data/ConfigService';
import { ICostConfig } from './data/ICostConfig';
import { Navbar } from '@strata/navbar/lib';
import Icon from '@strata/tempo/lib/icon/Icon';

const Navigation: React.FC = () => {
  const [costConfigs, setCostConfigs] = useState<ICostConfig[]>([]);
  const [selectedConfgItem, setSelectedCostConfigItem] = useState<ICostConfig>({
    name: 'PlaceHolder',
    costingConfigGuid: '000',
    isGLCosting: false,
    defaultChargeAllocationMethod: 0,
    fiscalYearID: 2021,
    type: 0,
    createdAt: new Date(),
    modifiedAtUtc: new Date()
  });

  const location = useLocation();

  const getActiveUrlKey = () => {
    if (location.pathname === '/') {
      return ['/overview'];
    }

    return [location.pathname];
  };

  useEffect(() => {
    const fetchData = async () => {
      const [costingConfigurations] = await Promise.all([costConfigService.getCostConfig()]);
      setCostConfigs(costingConfigurations);
    };
    fetchData();
  }, []);

  const handleClick = (key: React.Key) => {
    if (key === '1') alert('All Models Page');
    else if (key === '2') alert('New Model Modal');
    else {
      const costConfigItem = costConfigs.find((config) => config.costingConfigGuid === key);
      if (costConfigItem) setSelectedCostConfigItem(costConfigItem);
    }
  };

  return (
    <>
      <Layout>
        <Layout.Nav>
          <Navbar />
        </Layout.Nav>
        <Layout>
          <Layout.Sider collapsible>
            <Menu selectedKeys={getActiveUrlKey()}>
              <Menu.ItemGroup title=''>
                <Menu.Item key=''>
                  <ButtonMenu buttonText={selectedConfgItem?.name} type='title' selectedKeys={[selectedConfgItem?.costingConfigGuid]} onClick={(e) => handleClick(e.key)}>
                    {costConfigs.map((item) => (
                      <ButtonMenu.Item key={item.costingConfigGuid}>{item.name}</ButtonMenu.Item>
                    ))}
                    <ButtonMenu.Divider />
                    <ButtonMenu.Item key='1'>All Models</ButtonMenu.Item>
                    <ButtonMenu.Divider />
                    <ButtonMenu.Item key='2'>
                      <Icon name='Plus' />
                      New Model
                    </ButtonMenu.Item>
                  </ButtonMenu>
                </Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title=''>
                <Menu.Item key='/overview' href='/overview'>
                  Overview
                </Menu.Item>
                <Menu.Item key='/cost-audit' href='/cost-audit'>
                  Cost Audit
                </Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title='CATEGORIZE'>
                <Menu.Item key='/department-categorization' href='/department-categorization'>
                  Department Categorization
                </Menu.Item>
                <Menu.Item key='/cost-components' href='/cost-components'>
                  Cost Components
                </Menu.Item>
                <Menu.Item key='/variability' href='/variability'>
                  Variability
                </Menu.Item>
                <Menu.Item key='/statistic-drivers' href='/statistic-drivers'>
                  Statistic Drivers
                </Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title='ALIGN'>
                <Menu.Item key='/reclassification' href='/reclassification'>
                  Reclassification
                </Menu.Item>
                <Menu.Item key='/overhead-allocation' href='/overhead-allocation'>
                  Overhead Allocation
                </Menu.Item>
                <Menu.Item key='/cost-component-reclassification' href='/cost-component-reclassification'>
                  Cost Component Reclassification
                </Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title='ALLOCATE'>
                <Menu.Item key='/activity-code-designer' href='/activity-code-designer'>
                  Activity Code Designer
                </Menu.Item>
                <Menu.Item key='/charge-allocation' href='/charge-allocation'>
                  Charge Allocation
                </Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title='CONFIGURE'>
                <Menu.Item key='/drop-down-configuration' href='/drop-down-configuration'>
                  Drop-down Configuration
                </Menu.Item>
                <Menu.Item key='/manual-statistics' href='/manual-statistics'>
                  Manual Statistics
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu>
          </Layout.Sider>
          <Layout.Content>
            <Switch>
              <Route path={['/', '/overview']} exact component={Overview} key='overview'></Route>
              <Route path='/statistic-drivers' exact component={StatisticDrivers} key='statistic-drivers'></Route>
              <Route path='/cost-audit' exact component={CostAudit} key='cost-audit'></Route>
              <Route path='/department-categorization' exact component={DepartmentCategorization} key='department-categorization'></Route>
              <Route path='/cost-components' exact component={CostComponents} key='cost-components'></Route>
              <Route path='/variability' exact component={Variability} key='variability'></Route>
              <Route path='/reclassification' exact component={Reclassification} key='reclassification'></Route>
              <Route path='/overhead-allocation' exact component={OverheadAllocation} key='overhead-allocation'></Route>
              <Route path='/cost-component-reclassification' exact component={CostComponentReclassification} key='cost-component-reclassification'></Route>
              <Route path='/activity-code-designer' exact component={ActivityCodeDesigner} key='activity-code-designer'></Route>
              <Route path='/charge-allocation' exact component={ChargeAllocation} key='charge-allocation'></Route>
              <Route path='/drop-down-configuration' exact component={DropdownConfiguration} key='drop-down-configuration'></Route>
              <Route path='/manual-statistics' exact component={ManualStatistics} key='manual-statistics'></Route>
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Navigation;
