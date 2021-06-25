import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from './ICostConfig';
import { ICostingConfigEntityLinkage } from '../../costing-configs/data/ICostingConfigEntityLinkage';
import { IEntity } from '../../costing-configs/data/IEntity';
import { ICostConfigSaveData } from '../../costing-configs/data/ICostConfigSaveData';

const { httpGet, httpPost, httpDelete } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfigs: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
  },
  getCostConfig: (costingConfigGuid: string): Promise<ICostConfig> => {
    return httpGet<ICostConfig>(`costing-configs/${costingConfigGuid}`);
  },
  getCostingConfigEntityLinkages: (costingConfigGuid: string): Promise<ICostingConfigEntityLinkage[]> => {
    return httpGet<ICostingConfigEntityLinkage[]>(`costing-configs/entity-linkages/${costingConfigGuid}`);
  },
  getUtilEntities: (): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/entities`);
  },
  getGlPayrollEntities: (costingConfigGuid: string): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/filtered-entities/${costingConfigGuid}`);
  },
  addNewConfig: (costConfigSaveData: ICostConfigSaveData): Promise<ICostConfig> => {
    return httpPost<ICostConfig>(`costing-configs/`, costConfigSaveData);
  },
  deleteCostConfig: (costConfigGuid: string): Promise<string> => {
    return httpDelete<string>(`costing-configs/${costConfigGuid}`);
  }
};
