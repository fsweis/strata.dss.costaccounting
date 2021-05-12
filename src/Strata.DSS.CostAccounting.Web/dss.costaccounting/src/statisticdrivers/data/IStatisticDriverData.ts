export interface IStatisticDriverData {
    statisticDrivers: IStatisticDriver[];
    dataSources: IDataSource[];
    dataSourceLinks: IDataSourceLink[];
  }

  export interface IStatisticDriver{
    driverConfigGUID: string;
    dataTableGUID: string;
    hasRules: boolean; 
    isInverted:boolean;
    isNew:boolean;
    measureGUID:string;
    name:string;
    childRulesets:string[];
  }

  export interface IDataSourceLink{
    dataTableGUID: string;
    friendlyName:string;
    measureGUID:string;
    isFirstSelect:boolean
  }

  export interface IDataSource{
    dataTableGUID: string;
    friendlyName:string;
    globalID:string;
  }