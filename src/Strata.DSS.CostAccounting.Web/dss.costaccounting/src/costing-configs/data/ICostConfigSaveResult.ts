import { ICostConfig } from '../../shared/data/ICostConfig';

export interface ICostConfigSaveResult {
  success: boolean;
  message: string;
  costingConfig: ICostConfig;
}
