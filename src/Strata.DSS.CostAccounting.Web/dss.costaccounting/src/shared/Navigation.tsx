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
import CostingConfigProvider from './data/CostingConfigProvider';
import { costingConfigService } from './data/costingConfigService';
import { ICostingConfig } from './data/ICostingConfig';
import { systemSettingService } from './data/systemSettingService';
import { getPathConfigGuid } from './Utils';
const Navigation: React.FC = () => {
  const [costingConfigGuid, setCostingConfigGuid] = React.useState<string>('');
  const [costingConfigsFiltered, setCostingConfigsFiltered] = React.useState<ICostingConfig[]>([]);
  const [costingConfigs, setCostingConfigs] = React.useState<ICostingConfig[]>([]);

  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      const [costingConfigurations, currentFiscalYear] = await Promise.all([costingConfigService.getCostingConfigs(), systemSettingService.getCurrentFiscalYear()]);
      setCostingConfigs(costingConfigurations);
      if (costingConfigurations.length > 0) {
        const previousFiscalYear = currentFiscalYear - 1;
        const filtered = costingConfigurations.filter((c) => currentFiscalYear === c.fiscalYearId || previousFiscalYear === c.fiscalYearId);
        setCostingConfigsFiltered(filtered);
        setCostingConfigGuid(filtered[0]?.costingConfigGuid);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const pathConfigGuid = getPathConfigGuid(location.pathname);

    if (pathConfigGuid !== '') {
      if (pathConfigGuid !== costingConfigGuid) {
        setCostingConfigGuid(pathConfigGuid);
      }
    } else {
      // TODO: something here to redirect path without guid to path with guid?
      // This doesn't work but leaving so you know not to try it
      // history.push(`${splitPath[0]}/${costConfigGuid}`);
    }
  }, [costingConfigGuid, history, location]);
  return (
    <>
      <Layout>
        <Layout.Nav>
          <Navbar />
        </Layout.Nav>
        <Layout>
          <Layout.Sider collapsible>
            <CostMenu
              costingConfigsFiltered={costingConfigsFiltered}
              costingConfigs={costingConfigs}
              setCostingConfigs={(costConfigs: ICostingConfig[]) => setCostingConfigs(costConfigs)}
              setCostingConfigsFiltered={(costConfigs: ICostingConfig[]) => setCostingConfigsFiltered(costConfigs)}
            />
          </Layout.Sider>
          <Layout.Content>
            <CostingConfigProvider costingConfigGuid={costingConfigGuid}>
              <Switch>
                <Route path='/' exact render={() => <Redirect to={`/overview`}></Redirect>} key='default'></Route>
                <Route path='/overview' component={Overview} key='overview'></Route>
                <Route path='/statistic-drivers' component={StatisticDrivers} key='statistic-drivers'></Route>
                <Route path='/cost-audit' component={CostAudit} key='cost-audit'></Route>
                <Route path='/department-categorization' component={DepartmentCategorization} key='department-categorization'></Route>
                <Route path='/cost-components/:costingConfigGuid' component={CostComponents} key='cost-components'></Route>
                <Route path='/variability' component={Variability} key='variability'></Route>
                <Route path='/reclassification' component={Reclassification} key='reclassification'></Route>
                <Route path='/overhead-allocation' component={OverheadAllocation} key='overhead-allocation'></Route>
                <Route path='/cost-component-reclassification' component={CostComponentReclassification} key='cost-component-reclassification'></Route>
                <Route path='/activity-code-designer' component={ActivityCodeDesigner} key='activity-code-designer'></Route>
                <Route path='/charge-allocation' component={ChargeAllocation} key='charge-allocation'></Route>
                <Route path='/drop-down-configuration' component={DropdownConfiguration} key='drop-down-configuration'></Route>
                <Route path='/manual-statistics' component={ManualStatistics} key='manual-statistics'></Route>
              </Switch>
            </CostingConfigProvider>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};
export default Navigation;
