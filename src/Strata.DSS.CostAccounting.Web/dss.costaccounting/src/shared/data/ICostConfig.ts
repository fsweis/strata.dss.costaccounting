import { formatDiagnosticsWithColorAndContext } from 'typescript';

export interface ICostConfig {
  costingConfigGuid: string;
  name: string;
  description: string;
  isGLCosting: boolean;
  isPayrollCosting: boolean;
  isBudgetedAndActualCosting: boolean;
  isUtilizationEntityConfigured: boolean;
  defaultChargeAllocationMethod: number;

  fiscalYearID: number;
  fiscalMonthId: number;
  type: CostingType;
  createdAt: Date;
  modifiedAtUtc: Date;
  lastPublishedUtc: Date;
  isEditable: boolean;
  glPayrollEntities: number[];
  utilEntities: number[];
}

export enum CostingType {
  PatientCare = 0,
  Claims = 1
}

export const newCostConfig = (costConfig: Partial<ICostConfig> = {}): ICostConfig => {
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
      fiscalYearID: 0,
      fiscalMonthId: 0,
      type: 0,
      createdAt: new Date(),
      modifiedAtUtc: new Date(),
      lastPublishedUtc: new Date(),
      isEditable: true,
      glPayrollEntities: [],
      utilEntities: []
    },
    ...costConfig
  };
};
