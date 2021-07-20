import { getEmptyGuid, getNewGuid } from '../../shared/Utils';

import { CostingType } from '../../shared/enums/CostingTypeEnum';

export interface IStatisticDriver {
  displayId: string;
  driverConfigGuid: string;
  dataTableGuid: string;
  hasRules: boolean;
  isInverted: boolean;
  isUsed: boolean;
  measureGuid: string;
  name: string;
  costingType: CostingType;
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
      costingType: CostingType.PatientCare
    },
    ...driver
  };
};
