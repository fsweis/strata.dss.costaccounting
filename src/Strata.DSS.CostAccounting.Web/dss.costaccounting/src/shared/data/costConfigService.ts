import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from './ICostConfig';
import { IEntity } from '../../costing-configs/data/IEntity';
import { ICostingType } from '../../costing-configs/data/ICostingType';
import { ICostingMethod } from '../../costing-configs/data/ICostingMethod';
import { ICostConfigSaveResult } from '../../costing-configs/data/ICostConfigSaveResult';
import { ICostConfigSaveData } from '../../costing-configs/data/ICostConfigSaveData';

const { httpGet, httpPost, httpDelete } = getSecureService(appConfig.apiUrl);

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
  getCostingTypes: (): Promise<ICostingType[]> => {
    return httpGet<ICostingType[]>(`costing-configs/costing-types`);
  },
  getCostingMethods: (): Promise<ICostingMethod[]> => {
    return httpGet<ICostingMethod[]>(`costing-configs/costing-methods`);
  },
  addNewConfig: (costConfigSaveData: ICostConfigSaveData): Promise<ICostConfigSaveResult> => {
    return httpPost<ICostConfigSaveResult>(`costing-configs/`, costConfigSaveData);
  },
  getCostConfigForCopy: (costingConfigGuid: string): Promise<ICostConfig> => {
    return httpGet<ICostConfig>(`costing-configs/copy/${costingConfigGuid}`);
  },
  deleteCostConfig: (costConfigGuid: string): Promise<string> => {
    return httpDelete<string>(`costing-configs/${costConfigGuid}`);
  }
};
