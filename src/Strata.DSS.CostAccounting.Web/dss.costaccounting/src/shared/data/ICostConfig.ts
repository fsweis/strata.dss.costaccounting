export interface ICostConfig {
  costingConfigGuid: string;
  name: string;
  description: string;
  isGLCosting: boolean;
  defaultChargeAllocationMethod: number;
  fiscalYearID: number;
  type: number;
  createdAt: Date;
  modifiedAtUtc: Date;
  lastPublishedUtc: Date;
  isEditable: boolean;
}
