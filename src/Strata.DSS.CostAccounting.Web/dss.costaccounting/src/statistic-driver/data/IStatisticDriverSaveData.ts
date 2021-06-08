import { IStatisticDriver } from './IStatisticDriver';

export interface IStatisticDriverSaveData {
  updatedStatDrivers: IStatisticDriver[];
  deletedStatDrivers: string[];
}
