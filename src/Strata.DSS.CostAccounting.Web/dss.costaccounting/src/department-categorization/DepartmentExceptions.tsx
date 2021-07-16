import React, { useContext, useEffect, useState } from 'react';
import Button from '@strata/tempo/lib/button';
import Tooltip from '@strata/tempo/lib/tooltip';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid from '@strata/tempo/lib/datagrid';
import Modal from '@strata/tempo/lib/modal';
import Toast from '@strata/tempo/lib/toast';
import DropDown from '@strata/tempo/lib/dropdown';
import RouteConfirm from '@strata/tempo/lib/routeconfirm';
import { ICostingDepartmentTypeException, newDepartmentException } from './data/ICostingDepartmentTypeException';
import { IDepartment } from './data/IDepartment';
import { ExceptionTypeEnum, getExceptionDepartment, getExceptionName } from './enums/ExceptionTypeEnum';
import { DepartmentTypeEnum, getExceptionType } from './enums/DepartmentTypeEnum';
import cloneDeep from 'lodash/cloneDeep';
import { CostingConfigContext } from '../shared/data/CostingConfigContext';
import { departmentCategorizationService } from './data/departmentCategorizationService';

const DepartmentExceptions: React.FC = () => {
  const [deletedDepartmentIds, setDeletedDepartmentIds] = useState<number[]>([]);
  const [updatedExceptionIds, setUpdatedExceptionIds] = useState<string[]>([]);
  const [departmentData, setDepartmentData] = useState<IDepartment[]>([]);
  const [departmentExceptionData, setDepartmentExceptionData] = useState<ICostingDepartmentTypeException[]>([]);
  const [departmentExceptionGridData, setDepartmentExceptionGridData] = useState<ICostingDepartmentTypeException[]>([]);
  const gridRef = React.useRef<DataGrid>(null);
  const { costingConfig } = useContext(CostingConfigContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (costingConfig) {
          const [departmentExceptionData, departmentData] = await Promise.all([
            departmentCategorizationService.getDepartmentExceptions(costingConfig.costingConfigGuid),
            departmentCategorizationService.getDepartments(costingConfig.costingConfigGuid)
          ]);
          setDepartmentExceptionData(departmentExceptionData);
          setDepartmentExceptionGridData(cloneDeep(departmentExceptionData));
          setDepartmentData(departmentData);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [costingConfig]);

  const handleAddRow = () => {
    const newException: ICostingDepartmentTypeException = newDepartmentException();
    const updatedDepartmentExceptions = [newException].concat(departmentExceptionGridData);
    setDepartmentExceptionGridData(updatedDepartmentExceptions);
    const exceptionsToUpdate = [newException.displayId].concat(updatedExceptionIds);
    setUpdatedExceptionIds(exceptionsToUpdate);
  };

  const handleDelete = (exception: ICostingDepartmentTypeException) => {
    if (exception.departmentId !== 0 && exception.costingDepartmentExceptionTypeId !== 0) {
      const departmentsToDelete = [exception.departmentId].concat(deletedDepartmentIds);
      setDeletedDepartmentIds(departmentsToDelete);
    }
    const updatedExceptionList = departmentExceptionGridData.filter((exc) => exc !== null && exc.displayId !== exception.displayId);
    setDepartmentExceptionGridData(updatedExceptionList);
  };

  const filterDepartments = (cellValue: DepartmentTypeEnum, filterValue: string) => {
    if (typeof filterValue === 'string' && filterValue.trim() !== '' && filterValue.trim() !== '-') {
      filterValue = filterValue.toLowerCase().trim();
    } else {
      return true;
    }
    if (cellValue === null) {
      return false;
    }

    const department = departmentExceptionGridData.find((dept) => dept.departmentId === cellValue);

    if (department !== undefined) {
      return department.departmentName.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
    }
    return false;
  };

  const filterExceptionTypes = (cellValue: ExceptionTypeEnum, filterValue: string) => {
    if (typeof filterValue === 'string' && filterValue.trim() !== '' && filterValue.trim() !== '-') {
      filterValue = filterValue.toLowerCase().trim();
    } else {
      return true;
    }
    if (cellValue === null) {
      return false;
    }
    const exceptionName = ExceptionTypeEnum[cellValue];
    return exceptionName.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
  };

  const handleDepartmentChange = (newDepartmentId: number, exception: ICostingDepartmentTypeException) => {
    // Can't add exception if there is already an exception
    // Dropdown should prevent this from happening?

    if (departmentExceptionGridData.find((d) => d.departmentId === newDepartmentId)) {
      Modal.alert({
        title: 'Department Categorization',
        content: 'An exception for department ' + exception.departmentName + ' already exists.'
      });
      return;
    }
    // Get selected department
    const selectedDepartment = departmentData.find((d) => d.departmentId === newDepartmentId);

    if (selectedDepartment) {
      const updatedDepartmentExceptions = departmentExceptionGridData.map((exc) => {
        if (exc === exception) {
          return newDepartmentException({
            costingDepartmentExceptionTypeId: exc.costingDepartmentExceptionTypeId,
            departmentId: selectedDepartment.departmentId,
            originalDepartmentType: selectedDepartment.departmentType,
            departmentName: selectedDepartment.name,
            costingConfigGuid: costingConfig?.costingConfigGuid
          });
        }
        return exc;
      });
      setDepartmentExceptionGridData(updatedDepartmentExceptions);
      //add to updated exceptions
      if (!updatedExceptionIds.includes(exception.displayId)) {
        const exceptionsToUpdate = [exception.displayId].concat(updatedExceptionIds);
        setUpdatedExceptionIds(exceptionsToUpdate);
      }
    }
  };

  const getExceptionTypeOptions = (departmentType: DepartmentTypeEnum) => {
    const options = getExceptionType(departmentType).map((exceptionType) => {
      return { text: getExceptionName(exceptionType), value: exceptionType };
    });
    return options;
  };

  const handleExceptionTypeChange = (selectedExceptionTypeValue: ExceptionTypeEnum, exception: ICostingDepartmentTypeException) => {
    const exceptionOptions = getExceptionTypeOptions(exception.originalDepartmentType);
    const exceptionItem = exceptionOptions.find((x) => x.value === selectedExceptionTypeValue);
    if (exception !== null && exceptionItem) {
      const updatedDepartmentExceptions = departmentExceptionGridData.map((exc) => {
        if (exc === exception) {
          return {
            ...exc,
            exceptionType: selectedExceptionTypeValue,
            departmentTypeEnum: getExceptionDepartment(exceptionItem.value)
          };
        }
        return exc;
      });
      setDepartmentExceptionGridData(updatedDepartmentExceptions);
    }

    //add to updated exceptions
    const updateIndex = updatedExceptionIds.findIndex((id) => id === exception.displayId);
    if (updateIndex === -1) {
      updatedExceptionIds.push(exception.displayId);
      setUpdatedExceptionIds(updatedExceptionIds);
    }
  };

  const handleCancel = () => {
    if (updatedExceptionIds.length > 0 || deletedDepartmentIds.length > 0) {
      Modal.confirm({
        title: 'Discard unsaved changes?',
        okText: 'Discard Changes',
        cancelText: 'Keep Changes',
        onOk() {
          if (departmentExceptionGridData) {
            setUpdatedExceptionIds([]);
            setDeletedDepartmentIds([]);
            setDepartmentExceptionGridData(cloneDeep(departmentExceptionData));
          }
          Toast.show({
            message: 'Changes discarded'
          });
        }
      });
    }
  };

  const handleSave = async () => {
    if (!(await validateDepartmentExceptions())) {
      return;
    }
    const updatedExceptions = departmentExceptionGridData.filter(
      (exc) => (updatedExceptionIds.includes(exc.displayId) || exc.costingDepartmentExceptionTypeId === 0) && !deletedDepartmentIds.includes(exc.departmentId)
    );
    // Don't actually save if there are no changes
    if (!updatedExceptions.length && !deletedDepartmentIds.length) {
      Toast.show({
        toastType: 'info',
        message: 'No changes to save'
      });
      return;
    }

    try {
      setIsLoading(true);
      const departmentExceptions = await departmentCategorizationService.saveDepartementExceptions(updatedExceptions, deletedDepartmentIds);
      setDepartmentExceptionData(departmentExceptions);
      setDepartmentExceptionGridData(cloneDeep(departmentExceptions));
      setUpdatedExceptionIds([]);
      setDeletedDepartmentIds([]);
      Toast.show({
        toastType: 'success',
        message: 'Changes saved'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateDepartmentExceptions = async () => {
    if (!gridRef.current) {
      return false;
    }
    const invalidCells = await gridRef.current.validateGrid();
    if (invalidCells.length > 0) {
      const invalidKeys = invalidCells.map((cell) => cell.rowKey);
      const invalidRows: { rowNumber: number; displayId: string }[] = departmentExceptionGridData
        .map((exception, index) => {
          return { displayId: exception.displayId, rowNumber: index };
        })
        .filter((r) => invalidKeys.includes(r.displayId));

      const rowNumbers = invalidRows.map((r) => r.rowNumber + 1);
      Modal.alert({
        title: 'Changes not saved',
        content: `Fix errors in rows: ${rowNumbers.join(', ')}`,
        alertType: 'error'
      });
      return false;
    }
    return true;
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
        value={departmentExceptionGridData}
        scrollable
        dataKey='displayId'
        pager={{
          pageSize: 100,
          extra: (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type='primary' onClick={handleSave}>
                Save
              </Button>
            </>
          )
        }}
        loading={isLoading}
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
          items={departmentData}
          editable
          editor={(cellEditorArgs) => (
            <>
              <DropDown //TODO change this to a server side search
                value={cellEditorArgs.rowData.departmentId !== 0 ? cellEditorArgs.rowData.departmentId : ''}
                onChange={(value) => handleDepartmentChange(value as number, cellEditorArgs.rowData as ICostingDepartmentTypeException)}
                width={480}
                itemValueField='departmentId'
                itemTextField='name'
                items={departmentData}
                showSearch
              />
            </>
          )}
          validationRules={[
            {
              required: true,
              type: 'number'
            },
            {
              validator: (rule, value, callback, source, options) => {
                return value !== 0 && value !== undefined;
              },
              message: 'Required'
            }
          ]}
        />
        <DataGrid.DropDownColumn
          field='exceptionType'
          header='Exception Type'
          filter
          filterMatchMode='custom'
          filterFunction={filterExceptionTypes}
          width={240}
          itemValueField={'value'}
          itemTextField='text'
          items={getExceptionTypeOptions(DepartmentTypeEnum.All)}
          isCellEditable={(cellEditorArgs) => cellEditorArgs.rowData.departmentId !== 0}
          editor={(cellEditorArgs) => (
            <>
              {cellEditorArgs.rowData.departmentId !== 0 && (
                <DropDown
                  width={240}
                  onChange={(value) => handleExceptionTypeChange(value as number, cellEditorArgs.rowData)}
                  items={getExceptionTypeOptions(cellEditorArgs.rowData.originalDepartmentType)}
                  itemValueField='value'
                  itemTextField='text'
                  value={cellEditorArgs.rowData.departmentId !== 0 ? cellEditorArgs.rowData.exceptionType : undefined}
                />
              )}
            </>
          )}
          validationRules={[
            {
              required: true,
              type: 'number'
            }
          ]}
        />

        <DataGrid.EmptyColumn />
        <DataGrid.Column
          align='right'
          width={144}
          body={(rowData) => (
            <>
              <Tooltip placement='left' title='Delete'>
                <Button type='link' icon='Delete' onClick={() => handleDelete(rowData)} />
              </Tooltip>
            </>
          )}
        />
      </DataGrid>
      <RouteConfirm
        showPrompt={updatedExceptionIds.length > 0 || deletedDepartmentIds.length > 0 || departmentExceptionGridData.some((d) => d.costingDepartmentExceptionTypeId === 0)}
        title={'Discard unsaved changes?'}
        okText={'Discard Changes'}
        cancelText={'Keep Changes'}
      />
    </>
  );
};

export default DepartmentExceptions;
