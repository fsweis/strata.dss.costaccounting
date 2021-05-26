import { appConfig, getSecureService } from '@strata/core/lib';
import { IDataSource } from '../../shared/data/IDataSource';
import { ICostConfig } from './ICostConfig';
import { ICostConfigSaveData } from './ICostConfigSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const statisticDriverService = {
  getCostConfig: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`overview`);
  },
  saveCostCofig: (costConfigSaveData: ICostConfig): Promise<ICostConfig[]> => {
    return httpPost<ICostConfig[]>('overview/', costConfigSaveData);
  }
};