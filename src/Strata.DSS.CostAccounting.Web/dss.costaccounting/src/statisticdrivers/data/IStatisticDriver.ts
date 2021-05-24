export interface IStatisticDriver {
  driverConfigGuid: string;
  dataTableGuid: string;
  hasRules: boolean;
  isInverted: boolean;
  isNew: boolean;
  isUsed: boolean;
  measureGuid: string;
  name: string;
}
