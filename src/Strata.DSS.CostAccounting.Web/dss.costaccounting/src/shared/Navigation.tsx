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
import { costConfigService } from './data/costConfigService';
import { ICostConfig } from './data/ICostConfig';
import { systemSettingService } from './data/systemSettingService';
const Navigation: React.FC = () => {
  const [costConfigGuid, setCostConfigGuid] = React.useState<string>('');
  const [costConfigsFiltered, setCostConfigsFiltered] = React.useState<ICostConfig[]>([]);
  const [costConfigs, setCostConfigs] = React.useState<ICostConfig[]>([]);

  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      const [costingConfigurations, currentFiscalYear] = await Promise.all([costConfigService.getCostConfigs(), systemSettingService.getCurrentFiscalYear()]);
      setCostConfigs(costingConfigurations);
      if (costingConfigurations.length > 0) {
        const sorted = costingConfigurations.filter((c) => currentFiscalYear - c.fiscalYearId <= 1).sort((a, b) => a.name.localeCompare(b.name));
        setCostConfigsFiltered(sorted);
        setCostConfigGuid(sorted[0].costingConfigGuid);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const splitPath = location.pathname.split('/').filter((p) => p.trim() !== '');
    // TODO: better solution than this
    if (splitPath.length > 1) {
      const pathConfigGuid = splitPath[1];
      if (pathConfigGuid !== costConfigGuid) {
        setCostConfigGuid(pathConfigGuid);
      }
    } else {
      // TODO: something here to redirect path without guid to path with guid?
      // This doesn't work but leaving so you know not to try it
      // history.push(`${splitPath[0]}/${costConfigGuid}`);
    }
  }, [costConfigGuid, history, location]);
  return (
    <>
      <Layout>
        <Layout.Nav>
          <Navbar />
        </Layout.Nav>
        <Layout>
          <Layout.Sider collapsible>
            <CostMenu
              costConfigsFiltered={costConfigsFiltered}
              costConfigs={costConfigs}
              setCostConfigs={(costConfigs: ICostConfig[]) => setCostConfigs(costConfigs)}
              setCostConfigsFiltered={(costConfigs: ICostConfig[]) => setCostConfigsFiltered(costConfigs)}
            />
          </Layout.Sider>
          <Layout.Content>
            <CostConfigProvider costingConfigGuid={costConfigGuid}>
              <Switch>
                <Route path='/' exact render={() => <Redirect to={`/overview`}></Redirect>} key='default'></Route>
                <Route path='/overview' component={Overview} key='overview'></Route>
                <Route path='/statistic-drivers' component={StatisticDrivers} key='statistic-drivers'></Route>
                <Route path='/cost-audit' component={CostAudit} key='cost-audit'></Route>
                <Route path='/department-categorization' component={DepartmentCategorization} key='department-categorization'></Route>
                <Route path='/cost-components' component={CostComponents} key='cost-components'></Route>
                <Route path='/variability' component={Variability} key='variability'></Route>
                <Route path='/reclassification' component={Reclassification} key='reclassification'></Route>
                <Route path='/overhead-allocation' component={OverheadAllocation} key='overhead-allocation'></Route>
                <Route path='/cost-component-reclassification' component={CostComponentReclassification} key='cost-component-reclassification'></Route>
                <Route path='/activity-code-designer' component={ActivityCodeDesigner} key='activity-code-designer'></Route>
                <Route path='/charge-allocation' component={ChargeAllocation} key='charge-allocation'></Route>
                <Route path='/drop-down-configuration' component={DropdownConfiguration} key='drop-down-configuration'></Route>
                <Route path='/manual-statistics' component={ManualStatistics} key='manual-statistics'></Route>
              </Switch>
            </CostConfigProvider>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};
export default Navigation;
