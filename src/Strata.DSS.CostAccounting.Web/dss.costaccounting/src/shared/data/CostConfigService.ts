import { appConfig, getSecureService } from '@strata/core/lib';
import { ICostConfig } from './ICostConfig';
import { IEntity } from './IEntity';
import { IFiscalMonth } from './IFiscalMonth';
import { IFiscalYear } from './IFiscalYear';
import { ICostingType } from './ICostingType';
import { ICostingMethod } from './ICostingMethod';
import { ICostingPermissions } from './ICostingPermissions';
import { ICostConfigSaveResult } from './ICostConfigSaveResult';
import { ICostConfigSaveData } from './ICostConfigSaveData';

const { httpGet, httpPost } = getSecureService(appConfig.apiUrl);

export const costConfigService = {
  getCostConfig: (): Promise<ICostConfig[]> => {
    return httpGet<ICostConfig[]>(`costing-configs`);
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
  addNewConfig: (costConfigSaveData: ICostConfigSaveData): Promise<ICostConfigSaveResult> => {
    return httpPost<ICostConfigSaveResult>(`costing-configs/new-config`, costConfigSaveData);
  }
};
