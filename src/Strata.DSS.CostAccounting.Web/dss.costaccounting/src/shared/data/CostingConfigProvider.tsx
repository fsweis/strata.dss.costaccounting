import * as React from 'react';
import { useEffect } from 'react';
import { CostingConfigService } from './CostingConfigService';
import { ICostingConfig } from './ICostingConfig';
import { CostingConfigContext } from './CostingConfigContext';

export interface ICostingConfigProviderProps {
  costingConfigGuid: string;
  children: React.ReactNode;
}

const CostingConfigProvider: React.FC<ICostingConfigProviderProps> = ({ costingConfigGuid, children }: ICostingConfigProviderProps) => {
  const [config, setConfig] = React.useState<ICostingConfig>();

  useEffect(() => {
    const fetchData = async () => {
      const costingConfig = await CostingConfigService.getCostingConfig(costingConfigGuid);
      setConfig(costingConfig);
    };
    fetchData();
  }, [costingConfigGuid]);

  return <CostingConfigContext.Provider value={{ costingConfig: config }}>{children}</CostingConfigContext.Provider>;
};

export default CostingConfigProvider;
