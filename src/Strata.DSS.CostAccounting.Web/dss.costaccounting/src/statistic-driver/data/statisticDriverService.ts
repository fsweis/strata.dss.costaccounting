import { appConfig, getSecureService } from '@strata/core/lib';
import { IDataSource } from '../../shared/data/IDataSource';
import { IDataSourceLink } from './IDataSourceLink';
import { IStatisticDriver } from './IStatisticDriver';
import { IStatisticDriverSaveData } from './IStatisticDriverSaveData';
import { getNewGuid } from '../../shared/Utils';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const statisticDriverService = {
  getStatisticDrivers: async (costingType: number): Promise<IStatisticDriver[]> => {
    const drivers = await httpGet<IStatisticDriver[]>(`statistic-drivers?costingType=${costingType}`);
    drivers.forEach((d) => (d.displayId = getNewGuid()));
    return drivers;
  },
  getDataSources: (costingType: number): Promise<IDataSource[]> => {
    return httpGet<IDataSource[]>(`statistic-drivers/data-sources?costingType=${costingType}`);
  },
  getDataSourceLinks: (costingType: number): Promise<IDataSourceLink[]> => {
    return httpGet<IDataSourceLink[]>(`statistic-drivers/data-source-links?costingType=${costingType}`);
  },
  saveStatisticDrivers: (statisticDriverSaveData: IStatisticDriverSaveData): Promise<IStatisticDriver[]> => {
    return httpPost<IStatisticDriver[]>('statistic-drivers/', statisticDriverSaveData);
  }
};
