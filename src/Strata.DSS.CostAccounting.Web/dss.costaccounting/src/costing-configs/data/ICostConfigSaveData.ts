import { ICostConfig } from '../../shared/data/ICostConfig';

export interface ICostConfigSaveData {
  costingConfig: ICostConfig;
  glPayrollEntities: number[];
  utilEntities: number[];
}
