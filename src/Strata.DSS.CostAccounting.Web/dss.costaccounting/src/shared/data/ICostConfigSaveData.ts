import { ICostConfig } from './ICostConfig';

export interface ICostConfigSaveData {
  costingConfig: ICostConfig;
  glPayrollEntities: number[];
  utilEntities: number[];
}
