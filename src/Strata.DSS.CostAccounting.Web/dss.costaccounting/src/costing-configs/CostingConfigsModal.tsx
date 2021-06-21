import Button from '@strata/tempo/lib/button';
import Modal from '@strata/tempo/lib/modal';
import Spacing from '@strata/tempo/lib/spacing';
import Tooltip from '@strata/tempo/lib/tooltip';
import React, { useEffect, useState } from 'react';
import { ICostConfig } from '../shared/data/ICostConfig';
import Input from '@strata/tempo/lib/input';
import { costConfigService } from '../shared/data/costConfigService';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid, { IGlobalFilterValue } from '@strata/tempo/lib/datagrid/DataGrid';
export interface ICostingConfigsModalProps {
  visible: boolean;
  onCancel: () => void;
  costConfigs: ICostConfig[];
}
const CostingConfigsModal: React.FC<ICostingConfigsModalProps> = (props: ICostingConfigsModalProps) => {
  const handleCancel = () => {
    props.onCancel();
  };
  return (
    <>
      <Modal title='All Models' visible={props.visible} onCancel={handleCancel} footer={null} width='extraLarge'>
        <ActionBar filters={<Input search width={200} />} />
      </Modal>
    </>
  );
};
export default CostingConfigsModal;
