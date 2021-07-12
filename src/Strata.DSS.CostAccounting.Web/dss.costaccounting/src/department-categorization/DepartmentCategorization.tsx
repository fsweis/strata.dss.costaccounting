import React, { useContext, useEffect, useState } from 'react';
import Header from '@strata/tempo/lib/header';
import Button from '@strata/tempo/lib/button';
import Tabs from '@strata/tempo/lib/tabs';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import { departmentCategorizationService } from './data/departmentCategorizationService';
import { CostConfigContext } from '../shared/data/CostConfigContext';
import _ from 'lodash';
import { IDepartment } from './data/IDepartment';
import FilteredDepartments from './FilteredDepartments';
import DepartmentExceptions from './DepartmentExceptions';
import { DepartmentTypeEnum } from './enums/DepartmentTypeEnum';

const DepartmentCategorization: React.FC = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const { costConfig } = useContext(CostConfigContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentArray = await departmentCategorizationService.getDepartmentExceptions();
        setDepartments(departmentArray);
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
          <DepartmentExceptions departments={departments} gridLoading={gridLoading}></DepartmentExceptions>
        </Tabs.TabPane>
        <Tabs.TabPane key='2' tab='Overhead'>
          <FilteredDepartments departments={departments} departmentType={DepartmentTypeEnum.Overhead}></FilteredDepartments>
        </Tabs.TabPane>
        <Tabs.TabPane key='3' tab='Revenue'>
          <FilteredDepartments departments={departments} departmentType={DepartmentTypeEnum.Revenue}></FilteredDepartments>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default DepartmentCategorization;
