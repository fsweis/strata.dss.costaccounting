import { ICostConfig } from './ICostConfig';

export interface ICostConfigSaveData {
  addedStatDrivers: ICostConfig[];
  updatedStatDrivers: ICostConfig[];
  deletedStatDrivers: string[];
}