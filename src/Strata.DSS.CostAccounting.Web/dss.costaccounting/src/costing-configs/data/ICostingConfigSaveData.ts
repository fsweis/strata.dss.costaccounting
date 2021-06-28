import { ICostingConfig } from '../../shared/data/ICostingConfig';

export interface ICostingConfigSaveData {
  costingConfig: ICostingConfig;
  glPayrollEntities: number[];
  utilEntities: number[];
}
