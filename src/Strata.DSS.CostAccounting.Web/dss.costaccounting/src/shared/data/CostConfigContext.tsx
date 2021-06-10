import * as React from 'react';
import { ICostConfig } from './ICostConfig';

export interface ICostConfigContext {
  costConfig: ICostConfig | undefined;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CostConfigContext = React.createContext<ICostConfigContext>({ costConfig: undefined });
