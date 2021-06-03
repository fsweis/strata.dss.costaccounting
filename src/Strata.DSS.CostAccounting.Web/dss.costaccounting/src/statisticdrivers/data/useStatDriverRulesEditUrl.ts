import { appConfig } from '@strata/core/lib';
import { useOidcSession } from '@strata/core/lib';
import { queryBuilder } from './queryBuilder';

const { jazzUrl } = appConfig;

export default function useStatDriverRulesEditUrl() {
  const statDriverRulesEditPath = '/DSS/CostAccounting/StatisticDrivers/StatisticDriversRulesEditWindow.aspx';

  const jazzVersion = useOidcSession()?.jazzVersion;

  const buildLink = (costingConfigGuid: string, driverConfigGuid: string): string => {
    const params = { statisticDriverGuid: driverConfigGuid, configGuid: costingConfigGuid };
    const queryParams = queryBuilder.buildQueryParams(params);
    return encodeURI(jazzUrl + jazzVersion + statDriverRulesEditPath + queryParams);
  };

  return buildLink;
}
