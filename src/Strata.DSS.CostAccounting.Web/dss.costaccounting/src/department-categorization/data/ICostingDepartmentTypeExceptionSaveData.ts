import { ICollectionSaveData } from '../../shared/data/ICollectionSaveData';
import { ICostingDepartmentTypeException } from './ICostingDepartmentTypeException';
export interface ICostingDepartmentTypeExceptionSaveData extends ICollectionSaveData<ICostingDepartmentTypeException> {
  costingConfigGuid: string | undefined;
  deletedIds: number[];
}
