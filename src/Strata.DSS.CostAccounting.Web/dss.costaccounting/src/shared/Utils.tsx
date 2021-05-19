export const getNewGuid = function (): string {
  return getRandom4Digits() + getRandom4Digits() + '-' + getRandom4Digits() + '-' + getRandom4Digits() + '-' + getRandom4Digits() + '-' + getRandom4Digits() + getRandom4Digits() + getRandom4Digits();
};

export const getEmptyGuid = function (): string {
  return '00000000-0000-0000-0000-000000000000';
};

function getRandom4Digits(): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
