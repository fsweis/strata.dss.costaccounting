export interface ICostConfig {
    costingConfigGuid: string;
    name: string;
    isGLCosting: boolean;
    defaultChargeAllocationMethod: number;    
    fiscalYearID: number;
    type:number;
    createdAt: Date;
    modifiedAtUtc: Date;
  }