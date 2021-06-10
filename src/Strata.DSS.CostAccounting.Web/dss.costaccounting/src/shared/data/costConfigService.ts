import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from './ICostConfig';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfig: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
  }
};
