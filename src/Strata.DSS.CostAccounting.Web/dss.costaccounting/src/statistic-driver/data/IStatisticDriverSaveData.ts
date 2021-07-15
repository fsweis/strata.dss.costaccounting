import { ICollectionSaveData } from '../../shared/data/ICollectionSaveData';
import { IStatisticDriver } from './IStatisticDriver';

export interface IStatisticDriverSaveData extends ICollectionSaveData<IStatisticDriver> {
  costingType: number;
}
