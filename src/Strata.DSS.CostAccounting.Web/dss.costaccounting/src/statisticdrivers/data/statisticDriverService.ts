import { appConfig, getSecureService } from '@strata/core/lib';
import { IStatisticDriverData } from './IStatisticDriverData';
import { IStatisticDriverSaveData } from './IStatisticDriverSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const statisticDriverService = {
  getStatisticDrivers: (): Promise<IStatisticDriverData> => {
    return httpGet<IStatisticDriverData>(`statistic-drivers`);
  },
  saveStatisticDrivers: (statisticDriverSaveData: IStatisticDriverSaveData): Promise<boolean> => {
    return httpPost<boolean>('statistic-drivers/SaveStatisticDrivers/', statisticDriverSaveData);
  }
};
