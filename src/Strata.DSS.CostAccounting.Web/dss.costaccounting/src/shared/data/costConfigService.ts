import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from './ICostConfig';
import { IEntity } from './IEntity';
import { IFiscalMonth } from './IFiscalMonth';
import { IFiscalYear } from './IFiscalYear';
import { ICostingType } from '../../costing-configs/data/ICostingType';
import { ICostingMethod } from '../../costing-configs/data/ICostingMethod';
import { ICostingPermissions } from '../../costing-configs/data/ICostingPermissions';
import { ICostConfigSaveResult } from '../../costing-configs/data/ICostConfigSaveResult';

const { httpGet, httpPost, httpDelete } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfigs: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
  },
  getCostConfig: (costingConfigGuid: string): Promise<ICostConfig> => {
    return httpGet<ICostConfig>(`costing-configs/${costingConfigGuid}`);
  },
  getCostConfigForCopy: (costingConfigGuid: string): Promise<ICostConfig> => {
    return httpGet<ICostConfig>(`costing-configs/copy/${costingConfigGuid}`);
  },
  deleteCostConfig: (costConfigGuid: string): Promise<string> => {
    return httpDelete<string>(`costing-configs/${costConfigGuid}`);
  },
  getFiscalMonths: (): Promise<IFiscalMonth[]> => {
    return httpGet<IFiscalMonth[]>(`costing-configs/fiscal-month`);
  },
  getFiscalYears: (): Promise<IFiscalYear[]> => {
    return httpGet<IFiscalYear[]>(`costing-configs/fiscal-year`);
  },
  getEntities: (): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/entity`);
  },
  getFilteredEntities: (): Promise<IEntity[]> => {
    return httpGet<IEntity[]>(`costing-configs/filtered-entity`);
  },
  getCostingTypes: (): Promise<ICostingType[]> => {
    return httpGet<ICostingType[]>(`costing-configs/costing-type`);
  },
  getCostingMethods: (): Promise<ICostingMethod[]> => {
    return httpGet<ICostingMethod[]>(`costing-configs/costing-method`);
  },
  getCostingPermissions: (): Promise<ICostingPermissions> => {
    return httpGet<ICostingPermissions>(`costing-configs/costing-permissions`);
  },
  addNewConfig: (costConfig: ICostConfig): Promise<ICostConfigSaveResult> => {
    return httpPost<ICostConfigSaveResult>(`costing-configs/new-config`, costConfig);
  }
};
