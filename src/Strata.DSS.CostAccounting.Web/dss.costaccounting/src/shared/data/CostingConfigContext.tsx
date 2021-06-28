import * as React from 'react';
import { ICostingConfig } from './ICostingConfig';

export interface ICostingConfigContext {
  costingConfig: ICostingConfig | undefined;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CostingConfigContext = React.createContext<ICostingConfigContext>({ costingConfig: undefined });
