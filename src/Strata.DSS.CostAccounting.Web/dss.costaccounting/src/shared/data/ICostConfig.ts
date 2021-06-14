export interface ICostConfig {
  costingConfigGuid: string;
  name: string;
  description: string;
  isGLCosting: boolean;
  defaultChargeAllocationMethod: number;
  fiscalYearID: number;
  type: CostingType;
  createdAt: Date;
  modifiedAtUtc: Date;
  lastPublishedUtc: Date;
  isEditable: boolean;
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
      isGLCosting: false,
      defaultChargeAllocationMethod: 0,
      type: 0,
      fiscalYearID: 0,
      createdAt: new Date(),
      modifiedAtUtc: new Date()
    },
    ...costConfig
};
  };