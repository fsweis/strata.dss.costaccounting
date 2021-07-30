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
  const emptyGuid = getEmptyGuid();
  return newRollups.filter((x) => {
    if (x.costComponentRollupGuid === emptyGuid) {
      return true;
    }
    return originalRollups.find((y) => {
      return y.costComponentRollupGuid === x.costComponentRollupGuid && (y.name !== x.name || y.isExcluded !== x.isExcluded);
    });
  });
};

export const findDeletedRollupGuids = (newRollups: ICostComponentRollup[], originalRollups: ICostComponentRollup[]): string[] => {
  const emptyGuid = getEmptyGuid();
  return originalRollups
    .filter((x) => !newRollups.some((y) => y.costComponentRollupGuid === x.costComponentRollupGuid && y.costComponentRollupGuid !== emptyGuid))
    .map((z) => z.costComponentRollupGuid);
};
