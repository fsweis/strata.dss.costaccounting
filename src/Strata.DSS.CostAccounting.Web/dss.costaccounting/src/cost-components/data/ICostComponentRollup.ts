import { getEmptyGuid, getNewGuid } from '../../shared/Utils';
export interface ICostComponentRollup {
  displayId: string;
  costComponentRollupGuid: string;
  name: string;
  isExcluded: boolean;
  isUsed: boolean;
}

export const newCostComponentRollup = (costComponentRollup: Partial<ICostComponentRollup> = {}): ICostComponentRollup => {
  return {
    ...{
      displayId: getNewGuid(),
      costComponentRollupGuid: getEmptyGuid(),
      name: '',
      isExcluded: false,
      isUsed: false
    },
    ...costComponentRollup
  };
};
