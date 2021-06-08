export interface IStatisticDriver {
  driverConfigGuid: string;
  dataTableGuid: string;
  hasRules: boolean;
  isInverted: boolean;
  isUsed: boolean;
  measureGuid: string;
  name: string;
  costingType: number;
}
