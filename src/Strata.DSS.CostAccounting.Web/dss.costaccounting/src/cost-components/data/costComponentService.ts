import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostComponent } from './ICostComponent';
import { ICostComponentSaveData } from './ICostComponentSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const costComponentService = {
  getCostComponentMappings: (): Promise<ICostComponent[]> => {
    return httpGet<ICostComponent[]>(`cost-components/`);
  },
  saveCostComponentMappings: (costComponentSaveData: ICostComponentSaveData): Promise<ICostComponent[]> => {
    return httpPost<ICostComponent[]>('cost-components/', costComponentSaveData);
  }
};
