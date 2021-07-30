import { getEmptyGuid, getNewGuid } from '../../shared/Utils';
export interface ICostComponentRollup {
  displayId: string;
  costComponentRollupGuid: string;
  costingConfigGuid: string;
  name: string;
  isExcluded: boolean;
  isUsed: boolean;
}

export const newCostComponentRollup = (costComponentRollup: Partial<ICostComponentRollup> = {}): ICostComponentRollup => {
  return {
    ...{
      displayId: getNewGuid(),
      costComponentRollupGuid: getEmptyGuid(),
      costingConfigGuid: '',
      name: '',
      isExcluded: false,
      isUsed: false
    },
    ...costComponentRollup
  };
};

export const findUpdatedRollups = (newRollups: ICostComponentRollup[], originalRollups: ICostComponentRollup[]): ICostComponentRollup[] => {
  return newRollups.filter((x) => {
    if (!originalRollups.find((y) => y.displayId === x.displayId)) {
      return true;
    } else {
      return originalRollups.find((y) => {
        return y.displayId === x.displayId && (y.name !== x.name || y.isExcluded !== x.isExcluded);
      });
    }
  });
};

export const findDeletedRollupGuids = (newRollups: ICostComponentRollup[], originalRollups: ICostComponentRollup[]): string[] => {
  return originalRollups.filter((x) => !newRollups.some((y) => y.displayId === x.displayId)).map((z) => z.costComponentRollupGuid);
};
