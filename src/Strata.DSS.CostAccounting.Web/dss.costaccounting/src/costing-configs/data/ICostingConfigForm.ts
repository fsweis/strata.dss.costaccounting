import { CostingType } from '../../shared/enums/CostingTypeEnum';
import { CostingMethod } from '../enums/CostingMethodEnum';
import { CostingOption } from '../enums/CostingOptionEnum';
import { EntityType } from '../enums/EntityTypeEnum';

export interface ICostingConfigForm {
  name: string;
  description: string;
  fiscalYearId: number;
  fiscalMonthId: number;
  type: CostingType;
  glPayrollEntities: string[];
  entityType: number;
  utilizationEntities: string[];
  defaultMethod: number;
  options: number[];
  isCopy: boolean;
}

export const getNewCostingConfigForm = (): ICostingConfigForm => {
  return {
    name: '',
    description: '',
    fiscalYearId: 0,
    fiscalMonthId: 0,
    type: CostingType.PatientCare,
    glPayrollEntities: [],
    entityType: EntityType.GlPayroll,
    utilizationEntities: [],
    defaultMethod: CostingMethod.Simultaneous,
    options: [CostingOption.NotSpecified, CostingOption.NotSpecified],
    isCopy: false
  };
};
