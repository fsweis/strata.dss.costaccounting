import { appConfig, getSecureService } from '@strata/core/lib';

const { httpGet } = getSecureService(appConfig.apiUrl);

export const systemSettingService = {
  getIsClaimsCostingEnabled: (): Promise<boolean> => {
    return httpGet<boolean>(`system-setting/claims`);
  },
  getIsCostingEntityLevelSecurityEnabled: (): Promise<boolean> => {
    return httpGet<boolean>(`system-setting/entity-security`);
  },
  getCurrentFiscalYear: (): Promise<number> => {
    return httpGet<number>(`system-setting/fiscal-year`);
  }
};
