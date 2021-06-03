import { v4 as uuidv4 } from 'uuid';
import { NIL as uuidNil } from 'uuid';
export const getNewGuid = function (): string {
  return uuidv4();
};

export const getEmptyGuid = function (): string {
  return uuidNil;
};
