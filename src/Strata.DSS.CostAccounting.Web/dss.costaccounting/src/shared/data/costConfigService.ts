import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from './ICostConfig';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfigs: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
  },

  getCostConfig: (costingConfigGuid: string): Promise<ICostConfig> => {
    return httpGet<ICostConfig>(`costing-configs/${costingConfigGuid}`);
  }
};
