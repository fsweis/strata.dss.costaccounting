import { appConfig, getSecureService } from '@strata/core/lib';
import { IExampleUserData } from './IExampleUserData';

const { httpGet } = getSecureService(appConfig.apiUrl);

export const exampleUserService = {
  getUsers: (): Promise<IExampleUserData[]> => {
    return httpGet<IExampleUserData[]>(`Users`);
  }
};
