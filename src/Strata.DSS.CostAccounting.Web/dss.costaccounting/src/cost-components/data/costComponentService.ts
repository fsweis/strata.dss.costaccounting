import { appConfig, getSecureService } from '@strata/core/lib';
import { ICollectionSaveData } from '../../shared/data/ICollectionSaveData';
import { getNewGuid } from '../../shared/Utils';
import { ICostComponent } from './ICostComponent';

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
  }
};
