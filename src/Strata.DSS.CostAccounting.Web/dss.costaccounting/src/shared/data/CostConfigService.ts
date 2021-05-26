import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from './ICostConfig';
import { ICostConfigSaveData } from './ICostConfigSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfig: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
  },
  saveCostCofig: (costConfigSaveData: ICostConfigSaveData): Promise<ICostConfig[]> => {
    return httpPost<ICostConfig[]>('costing-configs/', costConfigSaveData);
  }
};