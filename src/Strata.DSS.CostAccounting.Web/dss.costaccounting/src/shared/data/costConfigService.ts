import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from '../data/ICostConfig';
import { IEntity } from '../../costing-configs/data/IEntity';
import { IFiscalMonth } from '../../costing-configs/data/IFiscalMonth';
import { IFiscalYear } from '../../costing-configs/data/IFiscalYear';
import { ICostingType } from '../../costing-configs/data/ICostingType';
import { ICostingMethod } from '../../costing-configs/data/ICostingMethod';
import { ICostingPermissions } from '../../costing-configs/data/ICostingPermissions';
import { ICostConfigSaveResult } from '../../costing-configs/data/ICostConfigSaveResult';
import { ICostConfigSaveData } from '../../costing-configs/data/ICostConfigSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfigs: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
  },
  getCostConfig: (costingConfigGuid: string): Promise<ICostConfig> => {
    return httpGet<ICostConfig>(`costing-configs/${costingConfigGuid}`);
  },
  getFiscalMonths: (): Promise<IFiscalMonth[]> => {
    return httpGet<IFiscalMonth[]>(`costing-configs/fiscal-months`);
  },
  getFiscalYears: (): Promise<IFiscalYear[]> => {
    return httpGet<IFiscalYear[]>(`costing-configs/fiscal-years`);
  },
  getEntities: (): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/entities`);
  },
  getFilteredEntities: (): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/filtered-entities`);
  },
  getCostingTypes: (): Promise<ICostingType[]> => {
    return httpGet<ICostingType[]>(`costing-configs/costing-types`);
  },
  getCostingMethods: (): Promise<ICostingMethod[]> => {
    return httpGet<ICostingMethod[]>(`costing-configs/costing-methods`);
  },
  getCostingPermissions: (): Promise<ICostingPermissions> => {
    return httpGet<ICostingPermissions>(`costing-configs/costing-permissions`);
  },
  addNewConfig: (costConfigSaveData: ICostConfigSaveData): Promise<ICostConfigSaveResult> => {
    return httpPost<ICostConfigSaveResult>(`costing-configs/`, costConfigSaveData);
  }
};
