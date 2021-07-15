import React, { useEffect, useState } from 'react';
import Button from '@strata/tempo/lib/button';
import Tooltip from '@strata/tempo/lib/tooltip';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid from '@strata/tempo/lib/datagrid';
import Modal from '@strata/tempo/lib/modal';
import Toast from '@strata/tempo/lib/toast';
import { usePageLoader } from '@strata/tempo/lib/pageloader';
import DropDown from '@strata/tempo/lib/dropdown';
import RouteConfirm from '@strata/tempo/lib/routeconfirm';
import { ICostingDepartmentExceptionType } from './data/ICostingDepartmentExceptionType';
import { ICostingDepartmentTypeException, newDepartmentException } from './data/ICostingDepartmentTypeException';
import { IDepartment } from './data/IDepartment';
import { ExceptionNameEnum } from './enums/ExceptionNameEnum';
import { ExceptionTypeEnum } from './enums/ExceptionTypeEnum';
import { DepartmentNameEnum } from './enums/DepartmentNameEnum';
import { DepartmentTypeEnum } from './enums/DepartmentTypeEnum';

export interface IDepartmentExceptionsProps {
  departmentExceptions: ICostingDepartmentTypeException[];
  departments: IDepartment[];
  gridLoading: boolean;
  costingConfigGuid: string;
  saveDepartmentExceptions: (updatedExceptions: ICostingDepartmentTypeException[], deletedDepartmentIds: number[]) => void;
}
const DepartmentExceptions: React.FC<IDepartmentExceptionsProps> = (props: IDepartmentExceptionsProps) => {
  const { departmentExceptions, gridLoading, departments, costingConfigGuid, saveDepartmentExceptions } = props;
  const [deletedDepartmentIds, setDeletedDepartmentIds] = useState<number[]>([]);
  const [updatedExceptionIds, setUpdatedExceptionIds] = useState<string[]>([]);
  const [exceptionDepartmentData, setExceptionDepartmentData] = useState<ICostingDepartmentTypeException[]>([]);
  const gridRef = React.useRef<DataGrid>(null);
  const { setLoading } = usePageLoader();

  useEffect(() => {
    setExceptionDepartmentData(departmentExceptions);
  }, [departmentExceptions]);

  const handleAddRow = () => {
    const newException: ICostingDepartmentTypeException = newDepartmentException();
    if (exceptionDepartmentData !== undefined) {
      const updatedDepartExceptions = [newException].concat(exceptionDepartmentData);
      setExceptionDepartmentData(updatedDepartExceptions);
    }
  };

  const handleDelete = (exception: ICostingDepartmentTypeException) => {
    if (exception.departmentId !== 0 && exception.costingDepartmentExceptionTypeId !== 0) {
      const departmentsToDelete = [exception.departmentId].concat(deletedDepartmentIds);
      setDeletedDepartmentIds(departmentsToDelete);
    }
    const updatedExceptionList = exceptionDepartmentData.filter((exc) => exc !== null && exc.displayId !== exception.displayId);
    setExceptionDepartmentData(updatedExceptionList);
  };

  const filterDepartments = (cellValue: number, filterValue: string) => {
    if (typeof filterValue === 'string' && filterValue.trim() !== '' && filterValue.trim() !== '-') {
      filterValue = filterValue.toLowerCase().trim();
    } else {
      return true;
    }
    if (cellValue === null) {
      return false;
    }

    const department = exceptionDepartmentData.find((dept) => dept.departmentId === cellValue);

    if (department !== undefined) {
      return department.name.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
    }
    return false;
  };

  const filterExceptionTypes = (cellValue: string, filterValue: string) => {
    if (typeof filterValue === 'string' && filterValue.trim() !== '' && filterValue.trim() !== '-') {
      filterValue = filterValue.toLowerCase().trim();
    } else {
      return true;
    }
    if (cellValue === null) {
      return false;
    }
    return cellValue.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
  };

  const getExceptionTypeOptions = (departmentType: string) => {
    let items: ICostingDepartmentExceptionType[];
    switch (departmentType) {
      case DepartmentNameEnum.Revenue:
        items = [
          { text: ExceptionNameEnum.RevenueToExcluded, value: ExceptionTypeEnum.RevenueToExcluded },
          { text: ExceptionNameEnum.RevenueToOverhead, value: ExceptionTypeEnum.RevenueToOverhead }
        ];
        break;
      case DepartmentNameEnum.Overhead:
        items = [
          { text: ExceptionNameEnum.OverheadToRevenue, value: ExceptionTypeEnum.OverheadToRevenue },
          { text: ExceptionNameEnum.OverheadToExcluded, value: ExceptionTypeEnum.OverheadToExcluded }
        ];
        break;
      case DepartmentNameEnum.Excluded:
        items = [
          { text: ExceptionNameEnum.ExcludedToOverhead, value: ExceptionTypeEnum.ExcludedToOverhead },
          { text: ExceptionNameEnum.ExcludedToRevenue, value: ExceptionTypeEnum.ExcludedToRevenue }
        ];
        break;
      default:
        items = [
          { text: ExceptionNameEnum.RevenueToExcluded, value: ExceptionTypeEnum.RevenueToExcluded },
          { text: ExceptionNameEnum.RevenueToOverhead, value: ExceptionTypeEnum.RevenueToOverhead },
          { text: ExceptionNameEnum.OverheadToRevenue, value: ExceptionTypeEnum.OverheadToRevenue },
          { text: ExceptionNameEnum.OverheadToExcluded, value: ExceptionTypeEnum.OverheadToExcluded },
          { text: ExceptionNameEnum.ExcludedToOverhead, value: ExceptionTypeEnum.ExcludedToOverhead },
          { text: ExceptionNameEnum.ExcludedToRevenue, value: ExceptionTypeEnum.ExcludedToRevenue }
        ];
        break;
    }
    return items;
  };

  const handleDepartmentChange = (newDepartmentId: number, exception: ICostingDepartmentTypeException) => {
    // Can't add exception if there is already an exception
    // Dropdown should prevent this from happening?

    if (exceptionDepartmentData.find((d) => d.departmentId === newDepartmentId)) {
      Modal.alert({
        title: 'Department Categorization',
        content: 'An exception for department ' + exception.name + ' already exists.'
      });
      return;
    }
    // Get selected department
    const selectedDepartment = departments.find((d) => d.departmentId === newDepartmentId);

    if (selectedDepartment) {
      const updatedDepartmentExceptions = exceptionDepartmentData.map((exc) => {
        if (exc === exception) {
          return newDepartmentException({
            costingDepartmentExceptionTypeId: exc.costingDepartmentExceptionTypeId,
            departmentId: selectedDepartment.departmentId,
            originalDepartmentType: selectedDepartment.departmentType,
            name: selectedDepartment.name,
            costingConfigGuid: costingConfigGuid
          });
        }
        return exc;
      });
      console.log(updatedDepartmentExceptions);
      setExceptionDepartmentData(updatedDepartmentExceptions);
      //add to updated exceptions
      if (!updatedExceptionIds.includes(exception.displayId)) {
        const exceptionsToUpdate = [exception.displayId].concat(updatedExceptionIds);
        setUpdatedExceptionIds(exceptionsToUpdate);
      }
    }
  };

  const handleExceptionTypeChange = (selectedExceptionTypeValue: number, exception: ICostingDepartmentTypeException) => {
    const exceptionOptions = getExceptionTypeOptions(exception.originalDepartmentType);
    const exceptionItem = exceptionOptions.find((x) => x.value === selectedExceptionTypeValue);
    if (exception !== null && exceptionItem !== undefined) {
      const updatedDepartmentExceptions = exceptionDepartmentData.map((exc) => {
        if (exc === exception) {
          return {
            ...exc,
            deptExceptionTypeName: exceptionItem.text,
            deptExceptionType: selectedExceptionTypeValue,
            departmentTypeEnum: getDepartmentExceptionType(exc.originalDepartmentType, exceptionItem.text)
          };
        }
        return exc;
      });
      setExceptionDepartmentData(updatedDepartmentExceptions);
    }

    //add to updated exceptions
    const updateIndex = updatedExceptionIds.findIndex((id) => id === exception.displayId);
    if (updateIndex === -1) {
      updatedExceptionIds.push(exception.displayId);
      setUpdatedExceptionIds(updatedExceptionIds);
    }
  };
  const getDepartmentExceptionType = (originalDepartmentType: string, exceptionDepartmentType: string) => {
    if (originalDepartmentType === DepartmentNameEnum.Revenue && exceptionDepartmentType === ExceptionNameEnum.RevenueToOverhead) return DepartmentTypeEnum.Overhead;
    if (originalDepartmentType === DepartmentNameEnum.Revenue && exceptionDepartmentType === ExceptionNameEnum.RevenueToExcluded) return DepartmentTypeEnum.Excluded;
    if (originalDepartmentType === DepartmentNameEnum.Overhead && exceptionDepartmentType === ExceptionNameEnum.OverheadToRevenue) return DepartmentTypeEnum.Revenue;
    if (originalDepartmentType === DepartmentNameEnum.Overhead && exceptionDepartmentType === ExceptionNameEnum.OverheadToExcluded) return DepartmentTypeEnum.Excluded;
    if (originalDepartmentType === DepartmentNameEnum.Excluded && exceptionDepartmentType === ExceptionNameEnum.ExcludedToRevenue) return DepartmentTypeEnum.Revenue;
    if (originalDepartmentType === DepartmentNameEnum.Excluded && exceptionDepartmentType === ExceptionNameEnum.ExcludedToOverhead) return DepartmentTypeEnum.Overhead;
    return DepartmentTypeEnum.Revenue;
  };
  const handleCancel = () => {
    if (updatedExceptionIds.length > 0 || deletedDepartmentIds.length > 0) {
      Modal.confirm({
        title: 'Discard unsaved changes?',
        okText: 'Discard Changes',
        cancelText: 'Keep Changes',
        onOk() {
          if (exceptionDepartmentData) {
            setUpdatedExceptionIds([]);
            setDeletedDepartmentIds([]);
            setExceptionDepartmentData(departmentExceptions);
          }
          Toast.show({
            message: 'Changes discarded'
          });
        }
      });
    }
  };

  const handleSave = async () => {
    if (await validateDepartmentExceptions()) {
      const updatedExceptions = exceptionDepartmentData.filter(
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
        setLoading(true);
        await saveDepartmentExceptions(updatedExceptions, deletedDepartmentIds);
        setUpdatedExceptionIds([]);
        setDeletedDepartmentIds([]);
        Toast.show({
          toastType: 'success',
          message: 'Changes saved'
        });
      } catch (error) {
        Modal.alert({
          title: 'Changes not saved',
          content: 'Try again later. If the problem persists, contact your system administrator.',
          alertType: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const validateDepartmentExceptions = async () => {
    if (!gridRef.current) {
      return false;
    }
    const invalidCells = await gridRef.current.validateGrid();
    if (invalidCells.length > 0) {
      const invalidKeys = invalidCells.map((cell) => cell.rowKey);
      const invalidRows: { rowNumber: number; displayId: string }[] = exceptionDepartmentData
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
        value={exceptionDepartmentData}
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
        loading={gridLoading}
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
          editable
          editor={(cellEditorArgs) => (
            <>
              <DropDown //TODO change this to a server side search
                value={cellEditorArgs.rowData.departmentId !== 0 ? cellEditorArgs.rowData.departmentId : ''}
                onChange={(value) => handleDepartmentChange(value as number, cellEditorArgs.rowData as ICostingDepartmentTypeException)}
                width={480}
                itemValueField='departmentId'
                itemTextField='name'
                items={departments}
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
          field='deptExceptionTypeName'
          header='Exception Type'
          filter
          filterMatchMode='custom'
          filterFunction={filterExceptionTypes}
          width={240}
          itemValueField='text'
          itemTextField='text'
          items={getExceptionTypeOptions('')}
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
                  value={cellEditorArgs.rowData.departmentId !== 0 ? cellEditorArgs.rowData.deptExceptionTypeName : ''}
                />
              )}
            </>
          )}
          validationRules={[
            {
              required: true,
              type: 'string'
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
        showPrompt={updatedExceptionIds.length > 0 || deletedDepartmentIds.length > 0 || exceptionDepartmentData.some((d) => d.costingDepartmentExceptionTypeId === 0)}
        title={'Discard unsaved changes?'}
        okText={'Discard Changes'}
        cancelText={'Keep Changes'}
      />
    </>
  );
};

export default DepartmentExceptions;
