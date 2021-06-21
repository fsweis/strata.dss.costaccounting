import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from '../data/ICostConfig';
import { IEntity } from '../../costing-configs/data/IEntity';
import { ICostConfigSaveData } from '../../costing-configs/data/ICostConfigSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfigs: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
  },
  getCostConfig: (costingConfigGuid: string): Promise<ICostConfig> => {
    return httpGet<ICostConfig>(`costing-configs/${costingConfigGuid}`);
  },
  getUtilEntities: (): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/entities`);
  },
  getGlPayrollEntities: (costingConfigGuid: string): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/filtered-entities/${costingConfigGuid}`);
  },
  addNewConfig: (costConfigSaveData: ICostConfigSaveData): Promise<ICostConfig> => {
    return httpPost<ICostConfig>(`costing-configs/`, costConfigSaveData);
  }
};
