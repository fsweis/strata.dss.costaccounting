import React, { useContext, useEffect, useState } from 'react';
import Header from '@strata/tempo/lib/header';
import Button from '@strata/tempo/lib/button';
import Tabs from '@strata/tempo/lib/tabs';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import { departmentCategorizationService } from './data/departmentCategorizationService';
import { CostConfigContext } from '../shared/data/CostConfigContext';
import { IDepartment } from './data/IDepartment';
import FilteredDepartments from './FilteredDepartments';
import DepartmentExceptions from './DepartmentExceptions';
import { DepartmentNameEnum } from './enums/DepartmentNameEnum';
import { ICostingDepartmentTypeException } from './data/ICostingDepartmentTypeException';
import { cloneDeep } from 'lodash';

const DepartmentCategorization: React.FC = () => {
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const { costConfig } = useContext(CostConfigContext);
  const [departmentExceptions, setDepartmentExceptions] = useState<ICostingDepartmentTypeException[]>([]);
  const [tempDepartmentExceptions, setTempDepartmentExceptions] = useState<ICostingDepartmentTypeException[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [overheadDepartments, setOverheadDepartments] = useState<IDepartment[]>([]);
  const [revenueDepartments, setRevenueDepartments] = useState<IDepartment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (costConfig) {
          const [departmentExceptionData, overheadDepartmentData, revenueDepartmentData, departmentData] = await Promise.all([
            departmentCategorizationService.getDepartmentExceptions(costConfig.costingConfigGuid),
            departmentCategorizationService.getDepartmentsByType(costConfig.costingConfigGuid, DepartmentNameEnum.Overhead),
            departmentCategorizationService.getDepartmentsByType(costConfig.costingConfigGuid, DepartmentNameEnum.Revenue),
            departmentCategorizationService.getDepartments(costConfig.costingConfigGuid)
          ]);
          setDepartmentExceptions(departmentExceptionData);
          setOverheadDepartments(overheadDepartmentData);
          setRevenueDepartments(revenueDepartmentData);
          setTempDepartmentExceptions(cloneDeep(departmentExceptionData));
          setDepartments(departmentData);
        }
      } finally {
        setGridLoading(false);
      }
    };
    setGridLoading(true);
    fetchData();
  }, [costConfig]);

  return (
    <>
      <Header
        title='Department Categorization'
        extra={
          <>
            <ButtonMenu
              buttonText='Reports'
              type='tertiary'
              onClick={() => {
                return;
              }}
            >
              <ButtonMenu.Item key='1'>Department Categorization Report</ButtonMenu.Item>
            </ButtonMenu>

            <Button type='tertiary' icon='InfoCircle' />
          </>
        }
      />
      <Tabs defaultActiveKey='1'>
        <Tabs.TabPane key='1' tab='Exceptions'>
          <DepartmentExceptions
            departmentExceptions={departmentExceptions}
            departments={departments}
            gridLoading={gridLoading}
            costingConfigGuid={costConfig ? costConfig.costingConfigGuid : ''}
          ></DepartmentExceptions>
        </Tabs.TabPane>
        <Tabs.TabPane key='2' tab='Overhead'>
          <FilteredDepartments departments={overheadDepartments} departmentType={DepartmentNameEnum.Overhead}></FilteredDepartments>
        </Tabs.TabPane>
        <Tabs.TabPane key='3' tab='Revenue'>
          <FilteredDepartments departments={revenueDepartments} departmentType={DepartmentNameEnum.Revenue}></FilteredDepartments>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default DepartmentCategorization;
