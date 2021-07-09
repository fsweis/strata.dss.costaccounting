import { ICostComponentAssignment } from './ICostComponentAssignment';

export interface ICostComponent {
  costComponentGuid: string;
  name: string;
  accounts: ICostComponentAssignment[];
  jobCodes: ICostComponentAssignment[];
  payCodes: ICostComponentAssignment[];
  rollup: string;
  usingCompensation: boolean;
}

export const newCostComponent = (costComponent: Partial<ICostComponent> = {}): ICostComponent => {
  return {
    ...{
      costComponentGuid: '',
      name: '',
      accounts: [],
      jobCodes: [],
      payCodes: [],
      rollup: '',
      usingCompensation: false
    },
    ...costComponent
  };
};
