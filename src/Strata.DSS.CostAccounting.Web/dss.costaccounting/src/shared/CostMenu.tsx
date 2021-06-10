import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Menu from '@strata/tempo/lib/menu';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import Icon from '@strata/tempo/lib/icon/Icon';
import { ICostConfig, newCostConfig } from './data/ICostConfig';
export interface ICostMenuProps {
  costConfigs: ICostConfig[];
}
const CostMenu: React.FC<ICostMenuProps> = ({ costConfigs }: ICostMenuProps) => {
  const [selectedCostConfigItem, setSelectedCostConfigItem] = useState<ICostConfig>(newCostConfig());
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    const splitPath = location.pathname.split('/').filter((p) => p.trim() !== '');
    // TODO: better solution than this
    if (splitPath.length > 1) {
      const pathConfigGuid = splitPath[1];
      const config = costConfigs.find((c) => c.costingConfigGuid === pathConfigGuid);
      if (config && config !== selectedCostConfigItem) {
        setSelectedCostConfigItem(config);
      }
    } else {
      if (costConfigs.length) {
        setSelectedCostConfigItem(costConfigs[0]);
      }
    }
  }, [costConfigs, location, selectedCostConfigItem]);
  const getActiveUrlKey = () => {
    if (location.pathname === '/') {
      return ['/overview'];
    }
    const currentLocation = '/' + location.pathname.split('/')[1];
    return [currentLocation];
  };
  const handleClick = (key: React.Key) => {
    if (key === '1') alert('All Models Page');
    else if (key === '2') alert('New Model Modal');
    else {
      const costConfigItem = costConfigs.find((config) => config.costingConfigGuid === key);
      if (costConfigItem) {
        const currentLocation = location.pathname.split('/')[1];
        history.push(`/${currentLocation}/${costConfigItem.costingConfigGuid}`);
      }
    }
  };
  return (
    <Menu selectedKeys={getActiveUrlKey()}>
      <Menu.ItemGroup title=''>
        <Menu.Item key=''>
          <ButtonMenu buttonText={selectedCostConfigItem?.name} type='title' selectedKeys={[selectedCostConfigItem?.costingConfigGuid]} onClick={(e) => handleClick(e.key)}>
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
        <Menu.Item key='/overview' href={`/overview/${selectedCostConfigItem.costingConfigGuid}`}>
          Overview
        </Menu.Item>
        <Menu.Item key='/cost-audit' href={`/cost-audit/${selectedCostConfigItem.costingConfigGuid}`}>
          Cost Audit
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title='CATEGORIZE'>
        <Menu.Item key='/department-categorization' href={`/department-categorization/${selectedCostConfigItem.costingConfigGuid}`}>
          Department Categorization
        </Menu.Item>
        <Menu.Item key='/cost-components' href={`/cost-components/${selectedCostConfigItem.costingConfigGuid}`}>
          Cost Components
        </Menu.Item>
        <Menu.Item key='/variability' href={`/variability/${selectedCostConfigItem.costingConfigGuid}`}>
          Variability
        </Menu.Item>
        <Menu.Item key='/statistic-drivers' href={`/statistic-drivers/${selectedCostConfigItem.costingConfigGuid}`}>
          Statistic Drivers
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title='ALIGN'>
        <Menu.Item key='/reclassification' href={`/reclassification/${selectedCostConfigItem.costingConfigGuid}`}>
          Reclassification
        </Menu.Item>
        <Menu.Item key='/overhead-allocation' href={`/overhead-allocation/${selectedCostConfigItem.costingConfigGuid}`}>
          Overhead Allocation
        </Menu.Item>
        <Menu.Item key='/cost-component-reclassification' href={`/cost-component-reclassification/${selectedCostConfigItem.costingConfigGuid}`}>
          Cost Component Reclassification
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title='ALLOCATE'>
        <Menu.Item key='/activity-code-designer' href={`/activity-code-designer/${selectedCostConfigItem.costingConfigGuid}`}>
          Activity Code Designer
        </Menu.Item>
        <Menu.Item key='/charge-allocation' href={`/charge-allocation/${selectedCostConfigItem.costingConfigGuid}`}>
          Charge Allocation
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title='CONFIGURE'>
        <Menu.Item key='/drop-down-configuration' href={`/drop-down-configuration/${selectedCostConfigItem.costingConfigGuid}`}>
          Drop-down Configuration
        </Menu.Item>
        <Menu.Item key='/manual-statistics' href={`/manual-statistics/${selectedCostConfigItem.costingConfigGuid}`}>
          Manual Statistics
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );
};
export default CostMenu;
