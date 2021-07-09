import { ICostComponent } from './ICostComponent';

export interface ICostComponentSaveData {
  updatedCostComponents: ICostComponent[];
  deletedCostComponentsGuids: string[];
}
