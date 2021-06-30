import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostingConfig } from './ICostingConfig';
import { ICostingConfigEntityLinkage } from '../../costing-configs/data/ICostingConfigEntityLinkage';
import { IEntity } from '../../costing-configs/data/IEntity';
import { ICostingConfigSaveData } from '../../costing-configs/data/ICostingConfigSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const costingConfigService = {
  getCostingConfigs: (): Promise<ICostingConfig[]> => {
    return httpGet<ICostingConfig[]>(`costing-configs`);
  },
  getCostingConfig: (costingConfigGuid: string): Promise<ICostingConfig> => {
    return httpGet<ICostingConfig>(`costing-configs/${costingConfigGuid}`);
  },
  getCostingConfigEntityLinkages: (costingConfigGuid: string): Promise<ICostingConfigEntityLinkage[]> => {
    return httpGet<ICostingConfigEntityLinkage[]>(`costing-configs/${costingConfigGuid}/entity-linkages`);
  },
  getUtilizationEntities: (): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/entities`);
  },
  getGlPayrollEntities: (costingConfigGuid: string): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/${costingConfigGuid}/filtered-entities`);
  },
  addNewCostingConfig: (costConfigSaveData: ICostingConfigSaveData): Promise<ICostingConfig> => {
    return httpPost<ICostingConfig>(`costing-configs/`, costConfigSaveData);
  },
  createDeleteCostingConfigTask: (costingConfigGuid: string): Promise<string> => {
    return httpPost<string>(`costing-configs`, costingConfigGuid);
  }
};
