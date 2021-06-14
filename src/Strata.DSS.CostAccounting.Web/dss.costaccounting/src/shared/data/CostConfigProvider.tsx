import * as React from 'react';
import { useEffect } from 'react';
import { costConfigService } from './garbageFile';
import { ICostConfig } from './ICostConfig';
import { CostConfigContext } from './CostConfigContext';

export interface ICostConfigProviderProps {
  costingConfigGuid: string;
  children: React.ReactNode;
}

const CostConfigProvider: React.FC<ICostConfigProviderProps> = ({ costingConfigGuid, children }: ICostConfigProviderProps) => {
  const [config, setConfig] = React.useState<ICostConfig>();

  useEffect(() => {
    const fetchData = async () => {
      const costingConfig = await costConfigService.getCostConfig(costingConfigGuid);
      setConfig(costingConfig);
    };
    fetchData();
  }, [costingConfigGuid]);

  return <CostConfigContext.Provider value={{ costConfig: config }}>{children}</CostConfigContext.Provider>;
};

export default CostConfigProvider;
