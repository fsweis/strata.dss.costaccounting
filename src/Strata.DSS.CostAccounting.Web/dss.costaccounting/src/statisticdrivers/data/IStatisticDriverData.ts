import { IStatisticDriver } from './IStatisticDriver';
import { IDataSource } from './IDataSource';
import { IDataSourceLink } from './IDataSourceLink';

export interface IStatisticDriverData {
  statisticDrivers: IStatisticDriver[];
  dataSources: IDataSource[];
  dataSourceLinks: IDataSourceLink[];
}
