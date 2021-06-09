import * as React from 'react';
import { ICostConfig } from './ICostConfig';

export interface ICostConfigContext {
  costConfig: ICostConfig;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CostConfigContext = React.createContext<ICostConfigContext>({ costConfig: null });
