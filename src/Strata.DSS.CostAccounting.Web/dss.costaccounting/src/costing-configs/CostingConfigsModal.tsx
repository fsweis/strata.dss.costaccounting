import Button from '@strata/tempo/lib/button';
import Modal from '@strata/tempo/lib/modal';
import React, { useEffect, useState } from 'react';
import { ICostConfig } from '../shared/data/ICostConfig';
import Input from '@strata/tempo/lib/input';
import { costConfigService } from '../shared/data/costConfigService';
import ActionBar from '@strata/tempo/lib/actionbar';
import CostingConfigModal from '../costing-configs/CostingConfigModal';
export interface ICostingConfigsModalProps {
  visible: boolean;
  onCancel: () => void;
}
const CostingConfigsModal: React.FC<ICostingConfigsModalProps> = (props: ICostingConfigsModalProps) => {
  const [costingConfigModalVisible, setCostingConfigModalVisible] = React.useState<boolean>(false);
  const [costConfigs, setCostConfigs] = useState<ICostConfig[]>([]);
  const handleCancel = () => {
    props.onCancel();
  };
  useEffect(() => {
    const fetchData = async () => {
      const costModels = await costConfigService.getCostConfigs();
      setCostConfigs(costModels);
    };
    fetchData();
  }, []);

  const handleAddConfig = (newConfig: ICostConfig) => {
    //const newCostConfigs = [...costConfigs, newConfig];
  };

  return (
    <>
      <Modal title='All Models' visible={props.visible} onCancel={handleCancel} footer={null} width='extraLarge'>
        <ActionBar
          filters={<Input search width={200} />}
          actions={
            <>
              <Button
                icon='Plus'
                onClick={() => {
                  setCostingConfigModalVisible(true);
                }}
              >
                Add Model
              </Button>
            </>
          }
        />
      </Modal>
      <CostingConfigModal
        visible={costingConfigModalVisible}
        onCancel={() => {
          setCostingConfigModalVisible(false);
        }}
        onSave={() => {
          setCostingConfigModalVisible(false);
        }}
        onAddConfig={(costingConfig: ICostConfig) => handleAddConfig(costingConfig)}
        costConfigs={costConfigs}
      ></CostingConfigModal>
    </>
  );
};
export default CostingConfigsModal;
