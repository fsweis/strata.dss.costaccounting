export interface ICostConfig {
  costingConfigGuid: string;
  name: string;
  isGLCosting: boolean;
  defaultChargeAllocationMethod: number;
  fiscalYearID: number;
  type: number;
  createdAt: Date;
  modifiedAtUtc: Date;
  description: string;
  fiscalMonthID: number;
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
      fiscalYearID: 0,
      type: 0,
      createdAt: new Date(),
      modifiedAtUtc: new Date(),
      description: '',
      fiscalMonthID: 0,
      isPayrollCosting: false,
      isBudgetedAndActualCosting: false,
      isUtilizationEntityConfigured: false
    },
    ...costConfig
  };
};
