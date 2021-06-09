import React from 'react';
import Layout from '@strata/tempo/lib/layout';
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
import { Navbar } from '@strata/navbar/lib';
import CostMenu from './CostMenu';

const Navigation: React.FC = () => {
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
            <Switch>
              <Route path={['/', '/overview/:id']} exact component={Overview} key='overview'></Route>
              <Route path='/statistic-drivers/:id' exact component={StatisticDrivers} key='statistic-drivers'></Route>
              <Route path='/cost-audit/:id' exact component={CostAudit} key='cost-audit'></Route>
              <Route path='/department-categorization/:id' exact component={DepartmentCategorization} key='department-categorization'></Route>
              <Route path='/cost-components/:id' exact component={CostComponents} key='cost-components'></Route>
              <Route path='/variability/:id' exact component={Variability} key='variability'></Route>
              <Route path='/reclassification/:id' exact component={Reclassification} key='reclassification'></Route>
              <Route path='/overhead-allocation/:id' exact component={OverheadAllocation} key='overhead-allocation'></Route>
              <Route path='/cost-component-reclassification/:id' exact component={CostComponentReclassification} key='cost-component-reclassification'></Route>
              <Route path='/activity-code-designer/:id' exact component={ActivityCodeDesigner} key='activity-code-designer'></Route>
              <Route path='/charge-allocation/:id' exact component={ChargeAllocation} key='charge-allocation'></Route>
              <Route path='/drop-down-configuration/:id' exact component={DropdownConfiguration} key='drop-down-configuration'></Route>
              <Route path='/manual-statistics/:id' exact component={ManualStatistics} key='manual-statistics'></Route>
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Navigation;
