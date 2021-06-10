import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Menu from '@strata/tempo/lib/menu';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import Icon from '@strata/tempo/lib/icon/Icon';
import { costConfigService } from './data/CostConfigService';
import { ICostConfig } from './data/ICostConfig';

const CostingMenu: React.FC = () => {
  const [costConfigs, setCostConfigs] = useState<ICostConfig[]>([]);
  const [selectedConfgItem, setSelectedCostConfigItem] = useState<ICostConfig>({
    name: '',
    costingConfigGuid: '',
    isGLCosting: false,
    defaultChargeAllocationMethod: 0,
    fiscalYearID: 0,
    type: 0,
    createdAt: new Date(),
    modifiedAtUtc: new Date()
  });

  const history = useHistory();

  const location = useLocation();

  const getActiveUrlKey = () => {
    if (location.pathname === '/') {
      return ['/overview'];
    }
    const currentLocation = '/' + location.pathname.split('/')[1];
    return [currentLocation];
  };

  useEffect(() => {
    const fetchData = async () => {
      const [costingConfigurations] = await Promise.all([costConfigService.getCostConfigs()]);
      if (costingConfigurations.length > 0) {
        const year = new Date().getFullYear();
        const sorted = costingConfigurations.filter((c) => year - c.fiscalYearID <= 1).sort((a, b) => a.name.localeCompare(b.name));
        setCostConfigs(sorted);
        setSelectedCostConfigItem(sorted[0]);
      }
    };
    fetchData();
  }, []);

  const handleClick = (key: React.Key) => {
    if (key === '1') alert('All Models Page');
    else if (key === '2') alert('New Model Modal');
    else {
      const costConfigItem = costConfigs.find((config) => config.costingConfigGuid === key);
      if (costConfigItem) {
        const currentLocation = location.pathname.split('/')[1];
        history.push(`/${currentLocation}/${costConfigItem.costingConfigGuid}`);
        setSelectedCostConfigItem(costConfigItem);
      }
    }
  };

  return (
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
        <Menu.Item key='/overview' href={`/overview/${selectedConfgItem.costingConfigGuid}`}>
          Overview
        </Menu.Item>
        <Menu.Item key='/cost-audit' href={`/cost-audit/${selectedConfgItem.costingConfigGuid}`}>
          Cost Audit
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title='CATEGORIZE'>
        <Menu.Item key='/department-categorization' href={`/department-categorization/${selectedConfgItem.costingConfigGuid}`}>
          Department Categorization
        </Menu.Item>
        <Menu.Item key='/cost-components' href={`/cost-components/${selectedConfgItem.costingConfigGuid}`}>
          Cost Components
        </Menu.Item>
        <Menu.Item key='/variability' href={`/variability/${selectedConfgItem.costingConfigGuid}`}>
          Variability
        </Menu.Item>
        <Menu.Item key='/statistic-drivers' href={`/statistic-drivers/${selectedConfgItem.costingConfigGuid}`}>
          Statistic Drivers
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title='ALIGN'>
        <Menu.Item key='/reclassification' href={`/reclassification/${selectedConfgItem.costingConfigGuid}`}>
          Reclassification
        </Menu.Item>
        <Menu.Item key='/overhead-allocation' href={`/overhead-allocation/${selectedConfgItem.costingConfigGuid}`}>
          Overhead Allocation
        </Menu.Item>
        <Menu.Item key='/cost-component-reclassification' href={`/cost-component-reclassification/${selectedConfgItem.costingConfigGuid}`}>
          Cost Component Reclassification
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title='ALLOCATE'>
        <Menu.Item key='/activity-code-designer' href={`/activity-code-designer/${selectedConfgItem.costingConfigGuid}`}>
          Activity Code Designer
        </Menu.Item>
        <Menu.Item key='/charge-allocation' href={`/charge-allocation/${selectedConfgItem.costingConfigGuid}`}>
          Charge Allocation
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title='CONFIGURE'>
        <Menu.Item key='/drop-down-configuration' href={`/drop-down-configuration/${selectedConfgItem.costingConfigGuid}`}>
          Drop-down Configuration
        </Menu.Item>
        <Menu.Item key='/manual-statistics' href={`/manual-statistics/${selectedConfgItem.costingConfigGuid}`}>
          Manual Statistics
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );
};

export default CostingMenu;
