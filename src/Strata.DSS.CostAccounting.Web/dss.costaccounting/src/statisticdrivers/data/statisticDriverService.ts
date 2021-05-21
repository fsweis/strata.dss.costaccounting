import { appConfig, getSecureService } from '@strata/core/lib';
import { IStatisticDriver } from './IStatisticDriver';
import { IStatisticDriverData } from './IStatisticDriverData';
import { IStatisticDriverSaveData } from './IStatisticDriverSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const statisticDriverService = {
  getStatisticDrivers: (): Promise<IStatisticDriverData> => {
    return httpGet<IStatisticDriverData>(`statistic-drivers`);
  },
  saveStatisticDrivers: (statisticDriverSaveData: IStatisticDriverSaveData): Promise<IStatisticDriver[]> => {
    return httpPost<IStatisticDriver[]>('statistic-drivers/SaveStatisticDrivers/', statisticDriverSaveData);
  },
  validateRemoveDriver: (driverConfigGUID: string): Promise<boolean> => {
    return httpGet<boolean>(`statistic-drivers/ValidateRemoveDriver?driverConfigGUID=${driverConfigGUID}`);
  }
};
