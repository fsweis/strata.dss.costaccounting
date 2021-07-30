import { ICollectionSaveData } from '../../shared/data/ICollectionSaveData';
import { ICostComponentRollup } from './ICostComponentRollup';

export interface ICostComponentRollupSaveData extends ICollectionSaveData<ICostComponentRollup> {
  costingConfigGuid: string;
}
