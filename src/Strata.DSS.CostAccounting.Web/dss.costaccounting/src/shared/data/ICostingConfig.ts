import { CostingType } from '../enums/CostingTypeEnum';
import { ICostingConfigEntityLinkage } from '../../costing-configs/data/ICostingConfigEntityLinkage';

export interface ICostingConfig {
  costingConfigGuid: string;
  name: string;
  description: string;
  isGLCosting: boolean;
  isPayrollCosting: boolean;
  isBudgetedAndActualCosting: boolean;
  isUtilizationEntityConfigured: boolean;
  defaultChargeAllocationMethod: number;
  defaultMethod: number;
  fiscalYearId: number;
  fiscalMonthId: number;
  type: CostingType;
  createdAt: Date;
  modifiedAtUtc: Date;
  lastPublishedUtc: Date;
  isEditable: boolean;
  entityLinkages: ICostingConfigEntityLinkage[];
}

export const newCostConfig = (costConfig: Partial<ICostingConfig> = {}): ICostingConfig => {
  return {
    ...{
      costingConfigGuid: '',
      name: '',
      description: '',
      isGLCosting: false,
      isPayrollCosting: false,
      isBudgetedAndActualCosting: false,
      isUtilizationEntityConfigured: false,
      defaultChargeAllocationMethod: 0,
      defaultMethod: 0,
      fiscalYearId: 0,
      fiscalMonthId: 0,
      type: CostingType.PatientCare,
      createdAt: new Date(),
      modifiedAtUtc: new Date(),
      lastPublishedUtc: new Date(),
      isEditable: true,
      entityLinkages: []
    },
    ...costConfig
  };
};
