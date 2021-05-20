export interface IStatisticDriver {
  driverConfigGUID: string;
  dataTableGUID: string;
  hasRules: boolean;
  isInverted: boolean;
  isNew: boolean;
  isUsed: boolean;
  measureGUID: string;
  name: string;
}
