import { IStatisticDriver } from './IStatisticDriver';

export interface IStatisticDriverSaveData {
  addedStatDrivers: IStatisticDriver[];
  updatedStatDrivers: IStatisticDriver[];
  deletedStatDrivers: string[];
}
