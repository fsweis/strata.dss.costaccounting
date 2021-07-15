import React, { useContext, useEffect, useState } from 'react';
import Header from '@strata/tempo/lib/header';
import Button from '@strata/tempo/lib/button';
import Tabs from '@strata/tempo/lib/tabs';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import { departmentCategorizationService } from './data/departmentCategorizationService';
import { CostingConfigContext } from '../shared/data/CostingConfigContext';
import { IDepartment } from './data/IDepartment';
import FilteredDepartments from './FilteredDepartments';
import DepartmentExceptions from './DepartmentExceptions';
import { DepartmentTypeEnum } from './enums/DepartmentTypeEnum';
import { ICostingDepartmentTypeException } from './data/ICostingDepartmentTypeException';

const DepartmentCategorization: React.FC = () => {
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const { costingConfig } = useContext(CostingConfigContext);
  const [departmentExceptions, setDepartmentExceptions] = useState<ICostingDepartmentTypeException[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [overheadDepartments, setOverheadDepartments] = useState<IDepartment[]>([]);
  const [revenueDepartments, setRevenueDepartments] = useState<IDepartment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (costingConfig) {
          const [departmentExceptionData, overheadDepartmentData, revenueDepartmentData, departmentData] = await Promise.all([
            departmentCategorizationService.getDepartmentExceptions(costingConfig.costingConfigGuid),
            departmentCategorizationService.getDepartmentsByType(costingConfig.costingConfigGuid, DepartmentTypeEnum.Overhead),
            departmentCategorizationService.getDepartmentsByType(costingConfig.costingConfigGuid, DepartmentTypeEnum.Revenue),
            departmentCategorizationService.getDepartments(costingConfig.costingConfigGuid)
          ]);
          setDepartmentExceptions(departmentExceptionData);
          setOverheadDepartments(overheadDepartmentData);
          setRevenueDepartments(revenueDepartmentData);
          setDepartments(departmentData);
        }
      } finally {
        setGridLoading(false);
      }
    };
    setGridLoading(true);
    fetchData();
  }, [costingConfig]);

  const fetchFilteredDepartments = async () => {
    try {
      setGridLoading(true);
      if (costingConfig) {
        const [overheadDepartmentData, revenueDepartmentData] = await Promise.all([
          departmentCategorizationService.getDepartmentsByType(costingConfig.costingConfigGuid, DepartmentTypeEnum.Overhead),
          departmentCategorizationService.getDepartmentsByType(costingConfig.costingConfigGuid, DepartmentTypeEnum.Revenue)
        ]);
        setOverheadDepartments(overheadDepartmentData);
        setRevenueDepartments(revenueDepartmentData);
      }
    } finally {
      setGridLoading(false);
    }
  };

  const saveDepartementExceptions = async (updatedExceptions: ICostingDepartmentTypeException[], deletedDepartmentIds: number[]) => {
    //refresh stat drivers from return
    const departmentExceptions = await departmentCategorizationService.saveDepartementExceptions(updatedExceptions, deletedDepartmentIds);
    setDepartmentExceptions(departmentExceptions);
    fetchFilteredDepartments();
  };

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
            costingConfigGuid={costingConfig ? costingConfig.costingConfigGuid : ''}
            saveDepartmentExceptions={saveDepartementExceptions}
          ></DepartmentExceptions>
        </Tabs.TabPane>
        <Tabs.TabPane key='2' tab='Overhead'>
          <FilteredDepartments departments={overheadDepartments}></FilteredDepartments>
        </Tabs.TabPane>
        <Tabs.TabPane key='3' tab='Revenue'>
          <FilteredDepartments departments={revenueDepartments}></FilteredDepartments>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default DepartmentCategorization;
