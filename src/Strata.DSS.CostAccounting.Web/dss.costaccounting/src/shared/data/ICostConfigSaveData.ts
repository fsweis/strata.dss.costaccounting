import { ICostConfig } from './ICostConfig';

export interface ICostConfigSaveData {
  addedCostConfigs: ICostConfig[];
  updatedCostConfigs: ICostConfig[];
  deletedCostConfigs: string[];
}