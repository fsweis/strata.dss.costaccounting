import { appConfig, getSecureService } from '@strata/core/lib';
import { IFiscalMonth } from './IFiscalMonth';
import { IFiscalYear } from './IFiscalYear';

const { httpGet } = getSecureService(appConfig.apiUrl);

export const dateService = {
  getFiscalMonths: (): Promise<IFiscalMonth[]> => {
    return httpGet<IFiscalMonth[]>(`date/fiscal-months`);
  },
  getFiscalYears: (): Promise<IFiscalYear[]> => {
    return httpGet<IFiscalYear[]>(`date/fiscal-years`);
  }
};
