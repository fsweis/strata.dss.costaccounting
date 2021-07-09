import React, { useContext, useEffect, useState } from 'react';
import Header from '@strata/tempo/lib/header';
import Button from '@strata/tempo/lib/button';
import Tooltip from '@strata/tempo/lib/tooltip';
import Tabs from '@strata/tempo/lib/tabs';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid from '@strata/tempo/lib/datagrid';
import DropDown, { DropDownValue } from '@strata/tempo/lib/dropdown';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import { IDepartmentCategorization } from './data/IDepartmentCategorization';
import { ICostingDepartmentExceptionType } from './data/ICostingDepartmentExceptionType';
import { ICostingDepartmentTypeException } from './data/ICostingDepartmentTypeException';
import { departmentCategorizationService } from './data/departmentCategorizationService';
import { CostConfigContext } from '../shared/data/CostConfigContext';
import _ from 'lodash';
import { IDepartment, newDepartment } from './data/IDepartment';
import { updateNamedImports } from 'typescript';

const DepartmentCategorization: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<IDepartment>();
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [deletedExceptions, setDeletedExceptions] = useState<number[]>([]);
  const [exceptionDepartmentData, setExceptionDepartmentData] = useState<IDepartment[]>([]);
  const [selectedExceptionTypes, setSelectedExceptionType] = useState<ICostingDepartmentExceptionType>();
  const [overheadDepartmentData, setOverheadDepartmentData] = useState<IDepartment[]>([]);
  const [revenueDepartmentData, setRevenueDepartmentData] = useState<IDepartment[]>([]);
  const gridRef = React.useRef<DataGrid>(null);
  const { costConfig } = useContext(CostConfigContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentArray = await departmentCategorizationService.getDepartmentExceptions();
        setDepartments(departmentArray);
        setExceptionDepartmentData(departmentArray.filter((dept) => dept.costingDepartmentTypeException !== undefined && dept.costingDepartmentTypeException !== null));

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

  const handleAddRow = () => {
    const newDept: IDepartment = newDepartment();
    if (exceptionDepartmentData !== undefined) {
      const updatedDepartExceptions = [newDept].concat(exceptionDepartmentData);
      setExceptionDepartmentData(updatedDepartExceptions);
    }
  };

  const handleDelete = (costingDepartmentExceptionTypeId: number) => {
    const exceptionsToDelete = [costingDepartmentExceptionTypeId].concat(deletedExceptions);
    setDeletedExceptions(exceptionsToDelete);

    const updatedExceptionList = exceptionDepartmentData.filter(
      (except) => except.costingDepartmentTypeException !== null && except.costingDepartmentTypeException.costingDepartmentExceptionTypeId !== costingDepartmentExceptionTypeId
    );

    setExceptionDepartmentData(updatedExceptionList);
  };

  const filterDepartments = (cellValue: number, filterValue: string) => {
    console.log('Filter value ' + filterValue, 'Cell value ' + cellValue);
    if (typeof filterValue === 'string' && filterValue.trim() !== '' && filterValue.trim() !== '-') {
      filterValue = filterValue.toLowerCase().trim();
    } else {
      return true;
    }
    if (cellValue === undefined || cellValue === null) {
      return false;
    }

    const department = exceptionDepartmentData.find((dept) => dept.departmentId === cellValue);

    if (department !== undefined) {
      console.log('Department Id and name:' + department?.departmentId, department?.name, 'found?:' + (department.name.indexOf(filterValue) > -1));
      return department.name.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
    }
    return false;
  };

  const filterExceptionTypes = (cellValue: ICostingDepartmentTypeException, filterValue: string) => {
    if (typeof filterValue === 'string' && filterValue.trim() !== '' && filterValue.trim() !== '-') {
      filterValue = filterValue.toLowerCase().trim();
    } else {
      return true;
    }
    if (cellValue === undefined || cellValue === null) {
      return false;
    }
    return cellValue.deptExceptionTypeName.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
  };

  const getExceptionTypeOptions = (exceptionType: string) => {
    let items: ICostingDepartmentExceptionType[];
    switch (exceptionType) {
      case 'Revenue':
        items = [
          { text: 'Revenue to Excluded', value: 1 },
          { text: 'Revenue to Overhead', value: 2 },
          { text: 'Overhead to Excluded', value: 4 },
          { text: 'Excluded to Overhead', value: 5 }
        ];
        break;
      case 'Overhead':
        items = [
          { text: 'Revenue to Excluded', value: 1 },
          { text: 'Overhead to Revenue', value: 3 },
          { text: 'Overhead to Excluded', value: 4 },
          { text: 'Excluded to Revenue', value: 6 }
        ];
        break;
      default:
        items = [
          { text: 'Revenue to Excluded', value: 1 },
          { text: 'Revenue to Overhead', value: 2 },
          { text: 'Overhead to Revenue', value: 3 },
          { text: 'Overhead to Excluded', value: 4 },
          { text: 'Excluded to Overhead', value: 5 },
          { text: 'Excluded to Revenue', value: 6 }
        ];
        break;
    }
    return items;
  };

  const handleDepartmentChange = (newValue: DropDownValue, currentValue: number) => {
    //TODO: CAN DUPLICATE EXCEPTIONS BE SAVED?
    let selectedValue = exceptionDepartmentData.find((d) => d.departmentId === newValue);

    if (selectedValue === undefined) {
      selectedValue = departments.find((d) => d.departmentId === newValue);
      if (selectedValue !== undefined) {
        const updatedExceptionDepartments = [selectedValue].concat(exceptionDepartmentData).filter((d) => d.departmentId !== currentValue);
        setExceptionDepartmentData(updatedExceptionDepartments);
      }
    }

    //setExceptionTypeOptions(selectedValue?.costingDepartmentTypeException?.costingDepartmentType || '');
  };

  const handleExceptionTypeChange = (selectedExceptionTypeValue: number, department: IDepartment) => {
    console.log(selectedExceptionTypeValue);
    const exceptionType = department.costingDepartmentTypeException ? department.costingDepartmentTypeException.costingDepartmentType : '';
    const exceptionOptions = getExceptionTypeOptions(exceptionType);
    const exceptionItem = exceptionOptions.find((x) => x.value === selectedExceptionTypeValue);
    if (department !== undefined) {
      const costingDepartmentTypeException = {
        costingDepartmentExceptionTypeId: department.costingDepartmentTypeException ? department.costingDepartmentTypeException.costingDepartmentExceptionTypeId : 0,
        departmentId: department.departmentId,
        costingConfigGuid: department.costingDepartmentTypeException ? department.costingDepartmentTypeException.costingConfigGuid : '',
        departmentTypeEnum: department.costingDepartmentTypeException ? department.costingDepartmentTypeException.departmentTypeEnum : 0,
        costingDepartmentType: department.costingDepartmentTypeException ? department.costingDepartmentTypeException.costingDepartmentType : '',
        deptExceptionTypeName: exceptionItem ? exceptionItem.text : '',
        deptExceptionType: selectedExceptionTypeValue
      };

      const updatedExceptionDepartments = exceptionDepartmentData.map((exception) => {
        if (exception.departmentId === department.departmentId) {
          return { ...exception, costingDepartmentTypeException: costingDepartmentTypeException };
        }
        return exception;
      });
      setExceptionDepartmentData(updatedExceptionDepartments);
    }

    //create switch on value and set the
    //costingDepartmentType: 'Overhead',
    // deptExceptionTypeName: 'Overhead to Revenue',
    //deptExceptionType: 2
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
          <ActionBar
            actions={
              <>
                <Button icon='Plus' onClick={handleAddRow}>
                  Add Exception
                </Button>
                <Button icon='Download'>Export</Button>
                <Button icon='Upload'>Import</Button>
              </>
            }
          />
          <DataGrid
            key='DepartmentExceptionGrid'
            ref={gridRef}
            dataKey='costingDepartmentExceptionTypeId'
            value={exceptionDepartmentData}
            loading={gridLoading}
            pager={{
              pageSize: 100,
              extra: (
                <>
                  <Button>Cancel</Button>
                  <Button type='primary'>Save</Button>
                </>
              )
            }}
          >
            <DataGrid.RowNumber />
            <DataGrid.DropDownColumn
              field='departmentId'
              header='Department'
              filter
              filterMatchMode='custom'
              filterFunction={filterDepartments}
              width={480}
              itemValueField='departmentId'
              itemTextField='name'
              items={departments}
              body={(rowData) => (
                <>
                  <DropDown //TODo change this to a server side search
                    onChange={(value) => handleDepartmentChange(value, rowData.departmentId)}
                    width={480}
                    value={rowData.departmentId}
                    itemValueField='departmentId'
                    itemTextField='name'
                    items={departments}
                  />
                </>
              )}
            />
            <DataGrid.DropDownColumn
              field='costingDepartmentTypeException'
              header='Exception Type'
              filter
              filterMatchMode='custom'
              filterFunction={filterExceptionTypes}
              width={240}
              body={(rowData) => (
                <>
                  <DropDown
                    width={200}
                    onChange={(value) => handleExceptionTypeChange(+value, rowData)}
                    items={getExceptionTypeOptions(rowData.costingDepartmentTypeException?.costingDepartmentType)}
                    itemValueField='value'
                    itemTextField='text'
                    value={rowData.costingDepartmentTypeException?.deptExceptionTypeName || ''}
                  />
                </>
              )}
            />

            <DataGrid.EmptyColumn />
            <DataGrid.Column
              align='right'
              width={144}
              body={(rowData) => (
                <>
                  <Tooltip placement='left' title='Delete'>
                    <Button type='link' icon='Delete' onClick={() => handleDelete(rowData.costingDepartmentTypeException.costingDepartmentExceptionTypeId)} />
                  </Tooltip>
                </>
              )}
            />
          </DataGrid>
        </Tabs.TabPane>
        <Tabs.TabPane key='2' tab='Overhead'>
          <DataGrid
            value={overheadDepartmentData}
            pager={{
              pageSize: 100,
              extra: (
                <>
                  <Button>Cancel</Button>
                  <Button type='primary'>Save</Button>
                </>
              )
            }}
          >
            <DataGrid.RowNumber />
            <DataGrid.Column header='Department' field='name' filter width={480} />
            <DataGrid.EmptyColumn />
          </DataGrid>
        </Tabs.TabPane>
        <Tabs.TabPane key='3' tab='Revenue'>
          <DataGrid
            value={revenueDepartmentData}
            pager={{
              pageSize: 100,
              extra: (
                <>
                  <Button>Cancel</Button>
                  <Button type='primary'>Save</Button>
                </>
              )
            }}
          >
            <DataGrid.RowNumber />
            <DataGrid.Column header='Department' field='name' filter width={480} />
            <DataGrid.EmptyColumn />
          </DataGrid>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default DepartmentCategorization;
