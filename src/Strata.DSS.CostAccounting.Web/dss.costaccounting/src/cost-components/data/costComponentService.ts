import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostComponent } from './ICostComponent';
import { ICostComponentSaveData } from './ICostComponentSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

const costComponents: ICostComponent[] = [
  { costComponentGuid: '123', name: 'CostComponent Numero Uno', accounts: [], jobCodes: [], payCodes: [], rollup: '', usingCompensation: false },
  { costComponentGuid: '456', name: 'Get Kate a passport', accounts: [], jobCodes: [], payCodes: [], rollup: '', usingCompensation: true }
];

export const costComponentService = {
  getCostComponentMappings: (): Promise<ICostComponent[]> => {
    //return httpGet<ICostComponent[]>(`cost-components/`);
    return Promise.resolve(costComponents);
  },
  saveCostComponentMappings: (costComponentSaveData: ICostComponentSaveData): Promise<ICostComponent[]> => {
    return httpPost<ICostComponent[]>('cost-components/', costComponentSaveData);
  }
};
