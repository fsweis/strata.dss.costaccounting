import { getNewGuid } from '../../shared/Utils';
import { ICostComponentAssignment } from './ICostComponentAssignment';

export interface ICostComponent {
  displayId: string;
  costComponentGuid: string;
  name: string;
  accounts: ICostComponentAssignment[];
  jobCodes: ICostComponentAssignment[];
  payCodes: ICostComponentAssignment[];
  costComponentRollupGuid: string;
  usingCompensation: boolean;
}

export const newCostComponent = (costComponent: Partial<ICostComponent> = {}): ICostComponent => {
  return {
    ...{
      displayId: getNewGuid(),
      costComponentGuid: '',
      name: '',
      accounts: [],
      jobCodes: [],
      payCodes: [],
      costComponentRollupGuid: '',
      usingCompensation: false
    },
    ...costComponent
  };
};
