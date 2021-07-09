import React, { useContext, useEffect, useState } from 'react';
import Header from '@strata/tempo/lib/header';
import Button from '@strata/tempo/lib/button';
import Tabs from '@strata/tempo/lib/tabs';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import { departmentCategorizationService } from './data/departmentCategorizationService';
import { CostConfigContext } from '../shared/data/CostConfigContext';
import _ from 'lodash';
import { IDepartment } from './data/IDepartment';
import OverheadDepartments from './OverheadDepartments';
import RevenueDepartments from './RevenueDepartments';
import DepartmentExceptions from './DepartmentExceptions';

const DepartmentCategorization: React.FC = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);

  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [overheadDepartmentData, setOverheadDepartmentData] = useState<IDepartment[]>([]);
  const [revenueDepartmentData, setRevenueDepartmentData] = useState<IDepartment[]>([]);
  const { costConfig } = useContext(CostConfigContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentArray = await departmentCategorizationService.getDepartmentExceptions();
        setDepartments(departmentArray);

        const overheadDepartments = departmentArray.filter((dept) => dept.departmentType === 'Overhead');
        const overriddenFromOverheadDepartments = filterDeptArray(departmentArray, 'Overhead', true);
        const overriddenToOverheadDepartments = filterDeptArray(departmentArray, 'Overhead', false);
        const overheadDepartmentsToDisplay = overheadDepartments.filter((dept) => !overriddenFromOverheadDepartments.includes(dept)).concat(overriddenToOverheadDepartments);
        setOverheadDepartmentData(overheadDepartmentsToDisplay);

        const revenueDepartments = departmentArray.filter((dept) => dept.departmentType === 'Revenue');
        const overriddenFromRevenueDepartments = filterDeptArray(departmentArray, 'Revenue', true);
        const overriddenToRevenueDepartments = filterDeptArray(departmentArray, 'Revenue', false);
        const revenueDepartmentsToDisplay = revenueDepartments.filter((dept) => !overriddenFromRevenueDepartments.includes(dept)).concat(overriddenToRevenueDepartments);
        setRevenueDepartmentData(revenueDepartmentsToDisplay);
      } finally {
        setGridLoading(false);
      }
    };
    setGridLoading(true);
    fetchData();
  }, [costConfig]);

  const filterDeptArray = (departmentArray: IDepartment[], deptType: string, overridden: boolean) => {
    if (overridden) {
      return departmentArray.filter(
        (dept) =>
          dept.departmentType === deptType &&
          dept.costingDepartmentTypeException !== null &&
          dept.costingDepartmentTypeException !== undefined &&
          !dept.costingDepartmentTypeException.deptExceptionTypeName.includes('to ' + deptType)
      );
    } else {
      return departmentArray.filter(
        (dept) =>
          dept.departmentType !== deptType &&
          dept.costingDepartmentTypeException !== null &&
          dept.costingDepartmentTypeException !== undefined &&
          dept.costingDepartmentTypeException.deptExceptionTypeName.includes('to ' + deptType)
      );
    }
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
          <DepartmentExceptions departments={departments} gridLoading={gridLoading}></DepartmentExceptions>
        </Tabs.TabPane>
        <Tabs.TabPane key='2' tab='Overhead'>
          <OverheadDepartments overheadDepartments={overheadDepartmentData}></OverheadDepartments>
        </Tabs.TabPane>
        <Tabs.TabPane key='3' tab='Revenue'>
          <RevenueDepartments revenueDepartments={revenueDepartmentData}></RevenueDepartments>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default DepartmentCategorization;
