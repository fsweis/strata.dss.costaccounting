export interface ICostConfig {
  costingConfigGuid: string;
  name: string;
  isGLCosting: boolean;
  defaultChargeAllocationMethod: number;
  fiscalYearId: number;
  type: number;
  createdAt: Date;
  modifiedAtUtc: Date;
  description: string;
  fiscalMonthId: number;
  isPayrollCosting: boolean;
  isBudgetedAndActualCosting: boolean;
  isUtilizationEntityConfigured: boolean;
}

export const newCostConfig = (costConfig: Partial<ICostConfig> = {}): ICostConfig => {
  return {
    ...{
      costingConfigGuid: '',
      name: '',
      isGLCosting: false,
      defaultChargeAllocationMethod: 0,
      fiscalYearId: 0,
      type: 0,
      createdAt: new Date(),
      modifiedAtUtc: new Date(),
      description: '',
      fiscalMonthId: 0,
      isPayrollCosting: false,
      isBudgetedAndActualCosting: false,
      isUtilizationEntityConfigured: false,
      defaultMethod: 0
    },
    ...costConfig
  };
};
