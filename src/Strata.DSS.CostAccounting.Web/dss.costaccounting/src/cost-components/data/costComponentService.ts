import { appConfig, getSecureService } from '@strata/core/lib';
import { ICollectionSaveData } from '../../shared/data/ICollectionSaveData';
import { getNewGuid } from '../../shared/Utils';
import { ICostComponent } from './ICostComponent';
import { ICostComponentRollup } from './ICostComponentRollup';
import { ICostComponentRollupSaveData } from './ICostComponentRollupSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

const costComponents: ICostComponent[] = [
  {
    displayId: getNewGuid(),
    costComponentGuid: '123',
    name: 'CostComponent Numero Uno',
    accounts: [],
    jobCodes: [],
    payCodes: [],
    costComponentRollupGuid: '273aba39-e394-43f8-97e2-f0fc572cc5fe',
    usingCompensation: false
  },
  {
    displayId: getNewGuid(),
    costComponentGuid: '456',
    name: 'Get Kate a passport',
    accounts: [],
    jobCodes: [],
    payCodes: [],
    costComponentRollupGuid: '45e8f712-9f4b-4914-ba8d-82452ad8926d',
    usingCompensation: true
  }
];

export const costComponentService = {
  getCostComponentMappings: (): Promise<ICostComponent[]> => {
    //return httpGet<ICostComponent[]>(`cost-components/`);
    return Promise.resolve(costComponents);
  },
  saveCostComponentMappings: (costComponentSaveData: ICollectionSaveData<ICostComponent>): Promise<ICostComponent[]> => {
    return httpPost<ICostComponent[]>('cost-components/', costComponentSaveData);
  },
  getCostComponentRollups: async (costingConfigGuid: string): Promise<ICostComponentRollup[]> => {
    const rollups = await httpGet<ICostComponentRollup[]>(`cost-components/rollups?costingConfigGuid=${costingConfigGuid}`);
    rollups.forEach((d) => (d.displayId = getNewGuid()));
    return rollups;
  },
  saveCostComponentRollups: (costComponentRollupSaveData: ICostComponentRollupSaveData): Promise<ICostComponentRollup[]> => {
    return httpPost<ICostComponentRollup[]>('cost-components/rollups', costComponentRollupSaveData);
  }
};
