import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from './ICostConfig';

const { httpGet, httpDelete } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfig: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
  },
  deleteCostConfig: (costConfigGuid: string): Promise<string> => {
    return httpDelete<string>(`costing-configs/` + costConfigGuid);
  }
};
