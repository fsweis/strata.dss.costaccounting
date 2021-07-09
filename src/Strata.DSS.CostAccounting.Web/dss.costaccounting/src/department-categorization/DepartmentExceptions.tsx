import React, { useContext, useEffect, useState } from 'react';
import Button from '@strata/tempo/lib/button';
import Tooltip from '@strata/tempo/lib/tooltip';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid from '@strata/tempo/lib/datagrid';
import DropDown, { DropDownValue } from '@strata/tempo/lib/dropdown';
import { ICostingDepartmentExceptionType } from './data/ICostingDepartmentExceptionType';
import { ICostingDepartmentTypeException } from './data/ICostingDepartmentTypeException';
import { IDepartment, newDepartment } from './data/IDepartment';
import { R2O, R2E, O2E, O2R, E2O, E2R } from './constants/ExceptionTypeConstants';
import { ExceptionTypeEnums } from './enums/ExceptionTypeEnums';
export interface IDepartmentExceptionsProps {
  departments: IDepartment[];
  gridLoading: boolean;
}
const DepartmentExceptions: React.FC<IDepartmentExceptionsProps> = (props: IDepartmentExceptionsProps) => {
  const [searchValue, setSearchValue] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [deletedExceptions, setDeletedExceptions] = useState<number[]>([]);
  const [exceptionDepartmentData, setExceptionDepartmentData] = useState<IDepartment[]>([]);
  const gridRef = React.useRef<DataGrid>(null);

  useEffect(() => {
    setExceptionDepartmentData(props.departments.filter((dept) => dept.costingDepartmentTypeException !== undefined && dept.costingDepartmentTypeException !== null));
  }, [props.departments]);

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
          { text: R2E, value: ExceptionTypeEnums.R2E },
          { text: R2O, value: ExceptionTypeEnums.R2O },
          { text: O2E, value: ExceptionTypeEnums.O2E },
          { text: E2O, value: ExceptionTypeEnums.E2O }
        ];
        break;
      case 'Overhead':
        items = [
          { text: R2E, value: ExceptionTypeEnums.R2E },
          { text: O2R, value: ExceptionTypeEnums.O2R },
          { text: O2E, value: ExceptionTypeEnums.O2E },
          { text: E2R, value: ExceptionTypeEnums.E2R }
        ];
        break;
      default:
        items = [
          { text: R2E, value: ExceptionTypeEnums.R2E },
          { text: R2O, value: ExceptionTypeEnums.R2O },
          { text: O2R, value: ExceptionTypeEnums.O2R },
          { text: O2E, value: ExceptionTypeEnums.O2E },
          { text: E2O, value: ExceptionTypeEnums.E2O },
          { text: E2R, value: ExceptionTypeEnums.E2R }
        ];
        break;
    }
    return items;
  };

  const handleDepartmentChange = (newValue: DropDownValue, currentValue: number) => {
    //TODO: CAN DUPLICATE EXCEPTIONS BE SAVED?
    let selectedValue = exceptionDepartmentData.find((d) => d.departmentId === newValue);

    if (selectedValue === undefined) {
      selectedValue = props.departments.find((d) => d.departmentId === newValue);
      if (selectedValue !== undefined) {
        const updatedExceptionDepartments = [selectedValue].concat(exceptionDepartmentData).filter((d) => d.departmentId !== currentValue);
        setExceptionDepartmentData(updatedExceptionDepartments);
      }
    }
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
  };
  return (
    <>
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
        loading={props.gridLoading}
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
          items={props.departments}
          body={(rowData) => (
            <>
              <DropDown //TODo change this to a server side search
                onChange={(value) => handleDepartmentChange(value, rowData.departmentId)}
                width={480}
                value={rowData.departmentId}
                itemValueField='departmentId'
                itemTextField='name'
                items={props.departments}
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
    </>
  );
};

export default DepartmentExceptions;
