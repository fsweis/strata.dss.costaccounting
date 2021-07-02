import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Menu from '@strata/tempo/lib/menu';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import { ICostingConfig, newCostConfig } from './data/ICostingConfig';
import CostingConfigsModal from '../costing-configs/CostingConfigsModal';
import { getPathConfigGuid } from './Utils';

export interface ICostMenuProps {
  costingConfigsFiltered: ICostingConfig[];
  costingConfigs: ICostingConfig[];
  setCostingConfigs: (costingConfigs: ICostingConfig[]) => void;
  setCostingConfigsFiltered: (costConfigs: ICostingConfig[]) => void;
}

const CostMenu: React.FC<ICostMenuProps> = ({ costingConfigsFiltered, costingConfigs, setCostingConfigs, setCostingConfigsFiltered }: ICostMenuProps) => {
  const [selectedCostingConfigItem, setSelectedCostingConfigItem] = useState<ICostingConfig>(newCostConfig());
  const [costingConfigsModalVisible, setCostingConfigsModalVisible] = React.useState<boolean>(false);
  const history = useHistory();
  const location = useLocation();
  const viewAndManageModels = 'ViewAndManageModels';

  useEffect(() => {
    const pathConfigGuid = getPathConfigGuid(location.pathname);

    if (pathConfigGuid !== '') {
      const config = costingConfigs.find((c) => c.costingConfigGuid === pathConfigGuid);
      if (config && config !== selectedCostingConfigItem) {
        setSelectedCostingConfigItem(config);
      }
    } else {
      if (costingConfigsFiltered.length) {
        setSelectedCostingConfigItem(costingConfigsFiltered[0]);
      }
    }
  }, [costingConfigs, costingConfigsFiltered, location, selectedCostingConfigItem]);

  const getActiveUrlKey = () => {
    const currentLocation = '/' + location.pathname.split('/')[1];
    return [currentLocation];
  };

  const handleClick = (key: React.Key) => {
    if (key === viewAndManageModels) {
      setCostingConfigsModalVisible(true);
    } else {
      const costingConfigItem = costingConfigs.find((config) => config.costingConfigGuid === key);
      if (costingConfigItem) {
        changeConfigs(costingConfigItem.costingConfigGuid);
      }
    }
  };

  const handleChangeConfigs = (costingConfigGuid: string) => {
    changeConfigs(costingConfigGuid);
    setCostingConfigsModalVisible(false);
  };

  const handleDeleteConfig = (costingConfigGuid: string) => {
    const updatedFilteredCostingConfigs = costingConfigsFiltered.filter((x) => x.costingConfigGuid !== costingConfigGuid);
    const updatedCostingConfigs = costingConfigs.filter((x) => x.costingConfigGuid !== costingConfigGuid);
    setCostingConfigsFiltered(updatedFilteredCostingConfigs);
    setCostingConfigs(updatedCostingConfigs);
  };

  const changeConfigs = (costingConfigGuid: string) => {
    const currentLocation = location.pathname.split('/')[1];
    history.push(`/${currentLocation}/${costingConfigGuid}`);
  };

  return (
    <>
      <Menu selectedKeys={getActiveUrlKey()}>
        <Menu.ItemGroup title=''>
          <Menu.Item key=''>
            <ButtonMenu buttonText={selectedCostingConfigItem?.name} type='title' selectedKeys={[selectedCostingConfigItem?.costingConfigGuid]} onClick={(e) => handleClick(e.key)}>
              {costingConfigsFiltered.map((item) => (
                <ButtonMenu.Item key={item.costingConfigGuid}>{item.name}</ButtonMenu.Item>
              ))}
              <ButtonMenu.Divider />
              <ButtonMenu.Item key={viewAndManageModels}>View & Manage Models</ButtonMenu.Item>
              <ButtonMenu.Divider />
            </ButtonMenu>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title=''>
          <Menu.Item key='/overview' href={`/overview/${selectedCostingConfigItem.costingConfigGuid}`}>
            Overview
          </Menu.Item>
          <Menu.Item key='/cost-audit' href={`/cost-audit/${selectedCostingConfigItem.costingConfigGuid}`}>
            Cost Audit
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title='CATEGORIZE'>
          <Menu.Item key='/department-categorization' href={`/department-categorization/${selectedCostingConfigItem.costingConfigGuid}`}>
            Department Categorization
          </Menu.Item>
          <Menu.Item key='/cost-components' href={`/cost-components/${selectedCostingConfigItem.costingConfigGuid}`}>
            Cost Components
          </Menu.Item>
          <Menu.Item key='/variability' href={`/variability/${selectedCostingConfigItem.costingConfigGuid}`}>
            Variability
          </Menu.Item>
          <Menu.Item key='/statistic-drivers' href={`/statistic-drivers/${selectedCostingConfigItem.costingConfigGuid}`}>
            Statistic Drivers
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title='ALIGN'>
          <Menu.Item key='/reclassification' href={`/reclassification/${selectedCostingConfigItem.costingConfigGuid}`}>
            Reclassification
          </Menu.Item>
          <Menu.Item key='/overhead-allocation' href={`/overhead-allocation/${selectedCostingConfigItem.costingConfigGuid}`}>
            Overhead Allocation
          </Menu.Item>
          <Menu.Item key='/cost-component-reclassification' href={`/cost-component-reclassification/${selectedCostingConfigItem.costingConfigGuid}`}>
            Cost Component Reclassification
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title='ALLOCATE'>
          <Menu.Item key='/activity-code-designer' href={`/activity-code-designer/${selectedCostingConfigItem.costingConfigGuid}`}>
            Activity Code Designer
          </Menu.Item>
          <Menu.Item key='/charge-allocation' href={`/charge-allocation/${selectedCostingConfigItem.costingConfigGuid}`}>
            Charge Allocation
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title='CONFIGURE'>
          <Menu.Item key='/drop-down-configuration' href={`/drop-down-configuration/${selectedCostingConfigItem.costingConfigGuid}`}>
            Drop-down Configuration
          </Menu.Item>
          <Menu.Item key='/manual-statistics' href={`/manual-statistics/${selectedCostingConfigItem.costingConfigGuid}`}>
            Manual Statistics
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
      <CostingConfigsModal
        onCancel={() => setCostingConfigsModalVisible(false)}
        onChangeConfigs={(costingConfigGuid: string) => handleChangeConfigs(costingConfigGuid)}
        onDeleteConfig={(costingConfigGuid: string) => handleDeleteConfig(costingConfigGuid)}
        visible={costingConfigsModalVisible}
      ></CostingConfigsModal>
    </>
  );
};
export default CostMenu;
