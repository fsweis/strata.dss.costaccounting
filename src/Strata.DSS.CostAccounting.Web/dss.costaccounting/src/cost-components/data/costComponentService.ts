import { appConfig, getSecureService } from '@strata/core/lib';
import { ICollectionSaveData } from '../../shared/data/ICollectionSaveData';
import { getNewGuid } from '../../shared/Utils';
import { ICostComponent } from './ICostComponent';
import { ICostComponentRollup } from './ICostComponentRollup';
import { ICostComponentRollupSaveData } from './ICostComponentRollupSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

const costComponents: ICostComponent[] = [
  { displayId: getNewGuid(), costComponentGuid: '123', name: 'CostComponent Numero Uno', accounts: [], jobCodes: [], payCodes: [], rollup: '', usingCompensation: false },
  { displayId: getNewGuid(), costComponentGuid: '456', name: 'Get Kate a passport', accounts: [], jobCodes: [], payCodes: [], rollup: '', usingCompensation: true }
];

export const costComponentService = {
  getCostComponentMappings: (): Promise<ICostComponent[]> => {
    //return httpGet<ICostComponent[]>(`cost-components/`);
    return Promise.resolve(costComponents);
  },
  saveCostComponentMappings: (costComponentSaveData: ICollectionSaveData<ICostComponent>): Promise<ICostComponent[]> => {
    return httpPost<ICostComponent[]>('cost-components/', costComponentSaveData);
  },
  getCostComponentRollups: (costingConfigGuid: string): Promise<ICostComponentRollup[]> => {
    return httpGet<ICostComponentRollup[]>(`cost-components/rollups?costingConfigGuid=${costingConfigGuid}`);
  },
  saveCostComponentRollups: (costComponentRollupSaveData: ICostComponentRollupSaveData): Promise<ICostComponentRollup[]> => {
    return httpPost<ICostComponentRollup[]>('cost-components/rollups', costComponentRollupSaveData);
  }
};
