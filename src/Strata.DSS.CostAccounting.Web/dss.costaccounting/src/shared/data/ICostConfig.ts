export interface ICostConfig {
  costingConfigGuid: string;
  name: string;
  isGLCosting: boolean;
  defaultChargeAllocationMethod: number;
  fiscalYearID: number;
  type: number;
  createdAt: Date;
  modifiedAtUtc: Date;
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
      modifiedAtUtc: new Date()
    },
    ...costConfig
  };
};
