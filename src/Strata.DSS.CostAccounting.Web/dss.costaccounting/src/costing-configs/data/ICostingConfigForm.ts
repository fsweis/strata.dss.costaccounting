export interface ICostingConfigForm {
  name: string;
  description: string;
  year: number;
  ytdMonth: number;
  type: number;
  glPayrollEntities: string[];
  entityType: number;
  utilEntities: string[];
  defaultMethod: number;
  options: number[];
  isCopy: boolean;
}
