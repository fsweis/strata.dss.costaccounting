import { appConfig, getSecureService } from '@strata/core/lib';
import { IDataSource } from '../../shared/data/IDataSource';
import { IDataSourceLink } from './IDataSourceLink';
import { IStatisticDriver } from './IStatisticDriver';
import { IStatisticDriverSaveData } from './IStatisticDriverSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const statisticDriverService = {
  getStatisticDrivers: (): Promise<IStatisticDriver[]> => {
    return httpGet<IStatisticDriver[]>(`statistic-drivers`);
  },
  getDataSources: (): Promise<IDataSource[]> => {
    return httpGet<IDataSource[]>(`statistic-drivers/DataSources`);
  },
  getDataSourceLinks: (): Promise<IDataSourceLink[]> => {
    return httpGet<IDataSourceLink[]>(`statistic-drivers/DataSourceLinks`);
  },
  saveStatisticDrivers: (statisticDriverSaveData: IStatisticDriverSaveData): Promise<IStatisticDriver[]> => {
    return httpPost<IStatisticDriver[]>('statistic-drivers/', statisticDriverSaveData);
  }
};
