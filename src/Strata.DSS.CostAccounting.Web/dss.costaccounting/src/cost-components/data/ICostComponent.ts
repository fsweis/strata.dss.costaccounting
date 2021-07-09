import { IDrawerAssignment } from '../../shared/data/IDrawerAssignment';

export interface ICostComponent {
  costComponentGuid: string;
  name: string;
  accounts: IDrawerAssignment[];
  jobCodes: IDrawerAssignment[];
  payCodes: IDrawerAssignment[];
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
