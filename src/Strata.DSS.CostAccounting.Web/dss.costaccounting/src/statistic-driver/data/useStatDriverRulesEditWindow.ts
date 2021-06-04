import useStatDriverRulesEditUrl from './useStatDriverRulesEditUrl';

export default function useStatDriverRulesEditWindow() {
  const getStatDriverEditRulesUrl = useStatDriverRulesEditUrl();
  const windowFeatures = 'scrollbars=0,toolbar=0,location=0,statusbar=0,menubar=0,resizable=1,width=1000,height=700,left=50,top=50';

  const openWindow = (costingConfigGuid: string, driverConfigGuid: string) => {
    const statDriverEditRulesUrl = getStatDriverEditRulesUrl(costingConfigGuid, driverConfigGuid);
    window.open(statDriverEditRulesUrl, costingConfigGuid, windowFeatures, false);
  };

  return openWindow;
}
