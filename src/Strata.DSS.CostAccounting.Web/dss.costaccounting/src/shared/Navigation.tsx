import React, { useEffect } from 'react';
import Layout from '@strata/tempo/lib/layout';
import { Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom';
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
import { Navbar } from '@strata/navbar/lib';
import CostMenu from './CostMenu';
import CostConfigProvider from './data/CostConfigProvider';
import { costConfigService } from './data/CostConfigService';

const Navigation: React.FC = () => {
  const [costConfigGuid, setCostConfigGuid] = React.useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const [costingConfigurations] = await Promise.all([costConfigService.getCostConfigs()]);
      if (costingConfigurations.length > 0) {
        const year = new Date().getFullYear();
        const sorted = costingConfigurations.filter((c) => year - c.fiscalYearID <= 1).sort((a, b) => a.name.localeCompare(b.name));
        setCostConfigGuid(sorted[0].costingConfigGuid);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const splitPath = location.pathname.split('/');
    if (splitPath.length > 2) {
      const pathConfigGuid = splitPath[2];
      setCostConfigGuid(pathConfigGuid);
    }
  }, [location]);

  return (
    <>
      <Layout>
        <Layout.Nav>
          <Navbar />
        </Layout.Nav>
        <Layout>
          <Layout.Sider collapsible>
            <CostMenu />
          </Layout.Sider>
          <Layout.Content>
            <CostConfigProvider costingConfigGuid={costConfigGuid}>
              <Switch>
                <Route path='/' exact render={() => <Redirect to='/overview'></Redirect>} key='default'></Route>
                <Route path='/overview/:configGuid' exact component={Overview} key='overview'></Route>
                <Route path='/statistic-drivers/:configGuid' exact component={StatisticDrivers} key='statistic-drivers'></Route>
                <Route path='/cost-audit/:configGuid' exact component={CostAudit} key='cost-audit'></Route>
                <Route path='/department-categorization/:configGuid' exact component={DepartmentCategorization} key='department-categorization'></Route>
                <Route path='/cost-components/:configGuid' exact component={CostComponents} key='cost-components'></Route>
                <Route path='/variability/:configGuid' exact component={Variability} key='variability'></Route>
                <Route path='/reclassification/:configGuid' exact component={Reclassification} key='reclassification'></Route>
                <Route path='/overhead-allocation/:configGuid' exact component={OverheadAllocation} key='overhead-allocation'></Route>
                <Route path='/cost-component-reclassification/:configGuid' exact component={CostComponentReclassification} key='cost-component-reclassification'></Route>
                <Route path='/activity-code-designer/:configGuid' exact component={ActivityCodeDesigner} key='activity-code-designer'></Route>
                <Route path='/charge-allocation/:configGuid' exact component={ChargeAllocation} key='charge-allocation'></Route>
                <Route path='/drop-down-configuration/:configGuid' exact component={DropdownConfiguration} key='drop-down-configuration'></Route>
                <Route path='/manual-statistics/:configGuid' exact component={ManualStatistics} key='manual-statistics'></Route>
              </Switch>
            </CostConfigProvider>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Navigation;
