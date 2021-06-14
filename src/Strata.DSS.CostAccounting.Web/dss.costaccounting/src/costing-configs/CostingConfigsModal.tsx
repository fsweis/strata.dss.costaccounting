import Button from '@strata/tempo/lib/button';
import Modal from '@strata/tempo/lib/modal';
import Spacing from '@strata/tempo/lib/spacing';
import Tooltip from '@strata/tempo/lib/tooltip';
import React, { useEffect, useState } from 'react';
import { ICostConfig, CostingType } from '../shared/data/ICostConfig';
import Input from '@strata/tempo/lib/input';
import { costConfigService } from '../shared/data/costConfigService';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid, { IGlobalFilterValue } from '@strata/tempo/lib/datagrid/DataGrid';
import { useHistory, useLocation } from 'react-router-dom';

export interface ICostingConfigsModalProps {
  visible: boolean;
  onCancel: () => void;
}

const CostingConfigsModal: React.FC<ICostingConfigsModalProps> = (props: ICostingConfigsModalProps) => {
  const [costModels, setCostModels] = useState<ICostConfig[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<IGlobalFilterValue>({ fields: ['name', 'description'], value: '' });
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const costModels = await costConfigService.getCostConfigs();
      setCostModels(costModels);
    };

    fetchData();
  }, []);

  const handleCancel = () => {
    props.onCancel();
  };

  const handleChangeConfigs = (costingConfigGuid: string) => {
    //TODO
    //Switch Configs
    const currentLocation = location.pathname.split('/')[1];
    history.push(`/${currentLocation}/${costingConfigGuid}`);
  };

  const handleCopy = (costingConfigGuid: string) => {
    //TODO
    //Open new modal
  };

  const handleDelete = (costingConfigGuid: string) => {
    costConfigService.deleteCostConfig(costingConfigGuid);
  };

  const getCostingTypeName = (type: CostingType) => {
    return type === CostingType.Claims ? 'Claims' : 'Patient Care';
  };

  return (
    <>
      <Modal title='All Models' visible={props.visible} onCancel={handleCancel} footer={null} width='extraLarge'>
        <ActionBar filters={<Input search width={200} onChange={(e) => setGlobalFilterValue({ fields: ['name', 'description'], value: e.target.value })} />} />
        <DataGrid key='allModelsGrid' scrollable dataKey='costingConfigGuid' value={costModels} globalFilterValue={globalFilterValue}>
          <DataGrid.RowNumber />
          <DataGrid.Column
            header='Name'
            width={320}
            sortable
            body={(rowData) => (
              <>
                <Spacing vAlign='center'>
                  <Button type='link' onClick={() => handleChangeConfigs(rowData.costingConfigGuid)}>
                    {rowData.name}
                  </Button>
                </Spacing>
              </>
            )}
          ></DataGrid.Column>
          <DataGrid.Column header='Description' field='description' collapseLongText width={280} sortable />
          <DataGrid.Column header='Type' field='type' width={120} body={(rowData) => getCostingTypeName(rowData.type)} sortable />
          <DataGrid.Column header='Fiscal Year' field='fiscalYearID' width={104} sortable />
          <DataGrid.DateColumn header='Last Edit' field='modifiedAtUtc' sortable width={128} />
          <DataGrid.DateColumn header='Last Published' field='lastPublishedRun' sortable width={128} />
          <DataGrid.Column
            align='right'
            width={80}
            sortable
            body={(rowData) => (
              <>
                <Spacing vAlign='center'>
                  <Tooltip title='Copy'>
                    <Button type='link' icon='Copy' onClick={() => handleCopy(rowData.costingConfigGuid)}></Button>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <Button type='link' icon='Delete' disabled={!rowData.isEditable} onClick={() => handleDelete(rowData.costingConfigGuid)}></Button>
                  </Tooltip>
                </Spacing>
              </>
            )}
          ></DataGrid.Column>
        </DataGrid>
      </Modal>
    </>
  );
};

export default CostingConfigsModal;
