export const queryBuilder = {
  buildQueryParams: (params: any): string => {
    const urlParams = Object.entries(params).reduce((prev, [key, value]) => {
      return prev + encodeURIComponent(key) + '=' + encodeURIComponent(value as string) + '&';
    }, '?');

    return urlParams.substr(0, urlParams.length - 1);
  }
};
