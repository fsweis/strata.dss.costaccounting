import { ICostingConfig } from '../../shared/data/ICostingConfig';

export interface ICostingConfigSaveData {
  costingConfig: ICostingConfig;
  glPayrollEntityIds: number[];
  utilizationEntityIds: number[];
}
