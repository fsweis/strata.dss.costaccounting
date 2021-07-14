import { getEmptyGuid, getNewGuid } from '../../shared/Utils';

export interface IStatisticDriver {
  displayId: string;
  driverConfigGuid: string;
  dataTableGuid: string;
  hasRules: boolean;
  isInverted: boolean;
  isUsed: boolean;
  measureGuid: string;
  name: string;
  costingType: number;
}

export const newStatisticDriver = (driver: Partial<IStatisticDriver> = {}): IStatisticDriver => {
  return {
    ...{
      displayId: getNewGuid(),
      driverConfigGuid: getEmptyGuid(),
      dataTableGuid: '',
      measureGuid: '',
      hasRules: false,
      isInverted: false,
      isUsed: false,
      name: '',
      costingType: 0
    },
    ...driver
  };
};
