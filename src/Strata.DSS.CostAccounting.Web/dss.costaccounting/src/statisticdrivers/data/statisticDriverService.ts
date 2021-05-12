import { appConfig, getSecureService } from '@strata/core/lib';
import { IStatisticDriverData } from './IStatisticDriverData';

const { httpGet } = getSecureService(appConfig.apiUrl);

export const statisticDriverService = {
  getStatisticDrivers: (): Promise<IStatisticDriverData> => {
    return httpGet<IStatisticDriverData>(`StatisticDrivers`);
  }
};
