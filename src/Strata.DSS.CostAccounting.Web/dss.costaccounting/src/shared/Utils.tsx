import { v4 as uuidv4 } from 'uuid';
import { NIL as uuidNil } from 'uuid';

export const getNewGuid = function (): string {
  return uuidv4();
};

export const getEmptyGuid = function (): string {
  return uuidNil;
};

export const getPathConfigGuid = function (pathname: string): string {
  const emptyPathGuid = '';
  if (pathname === undefined) return emptyPathGuid;

  const splitPath = pathname.split('/').filter((p) => p.trim() !== '');

  if (splitPath.length > 1) {
    return splitPath[1];
  }

  return emptyPathGuid;
};
