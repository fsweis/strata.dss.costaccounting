import { appConfig, getSecureService } from '@strata/core/lib';
import { IExampleDatabaseData } from './IExampleDatabaseData';

const { httpGet } = getSecureService(appConfig.apiUrl);

export const exampleDatabaseService = {
  getDatabases: (): Promise<IExampleDatabaseData[]> => {
    return httpGet<IExampleDatabaseData[]>(`Databases`);
  },

  getMessage: (): Promise<string> => {
    return httpGet<string>(`Databases/Hello`);
  }
};
