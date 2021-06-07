import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from './ICostConfig';
import { IFiscalMonth } from './IFiscalMonth';
import { IFiscalYear } from './IFiscalYear';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfig: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
  },
  getFiscalMonths: (): Promise<IFiscalMonth[]> => {
    return httpGet<IFiscalMonth[]>(`costing-configs/fiscal-month`);
  },
  getFiscalYears: (): Promise<IFiscalYear[]> => {
    return httpGet<IFiscalYear[]>(`costing-configs/fiscal-year`);
  }
};
