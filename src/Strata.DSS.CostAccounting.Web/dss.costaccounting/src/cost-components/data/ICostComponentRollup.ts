import { getNewGuid } from '../../shared/Utils';
export interface ICostComponentRollup {
  displayId: string;
  costComponentRollupGUID: string;
  name: string;
  isExcluded: boolean;
}

export const newCostComponentRollup = (costComponentRollup: Partial<ICostComponentRollup> = {}): ICostComponentRollup => {
  return {
    ...{
      displayId: getNewGuid(),
      costComponentRollupGUID: '',
      name: '',

      isExcluded: false
    },
    ...costComponentRollup
  };
};
