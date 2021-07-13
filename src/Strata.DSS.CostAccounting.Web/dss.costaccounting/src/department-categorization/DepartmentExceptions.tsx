import React, { useEffect, useState } from 'react';
import Button from '@strata/tempo/lib/button';
import Tooltip from '@strata/tempo/lib/tooltip';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid from '@strata/tempo/lib/datagrid';
import Modal from '@strata/tempo/lib/modal';
import Toast from '@strata/tempo/lib/toast';
import { usePageLoader } from '@strata/tempo/lib/pageloader';
import DropDown from '@strata/tempo/lib/dropdown';
import { ICostingDepartmentExceptionType } from './data/ICostingDepartmentExceptionType';
import { ICostingDepartmentTypeException } from './data/ICostingDepartmentTypeException';
import { IDepartment, newDepartment } from './data/IDepartment';
import { ExceptionNameEnum } from './enums/ExceptionNameEnum';
import { ExceptionTypeEnum } from './enums/ExceptionTypeEnum';
import { DepartmentTypeEnum } from './enums/DepartmentTypeEnum';
import { departmentCategorizationService } from './data/departmentCategorizationService';
export interface IDepartmentExceptionsProps {
  departments: IDepartment[];
  gridLoading: boolean;
}
const DepartmentExceptions: React.FC<IDepartmentExceptionsProps> = (props: IDepartmentExceptionsProps) => {
  const { departments, gridLoading } = props;
  const [deletedExceptions, setDeletedExceptions] = useState<number[]>([]);
  const [exceptionDepartmentData, setExceptionDepartmentData] = useState<IDepartment[]>([]);
  const [updatedExceptions, setUpdatedExceptions] = useState<IDepartment[]>([]);
  const gridRef = React.useRef<DataGrid>(null);
  const { setLoading } = usePageLoader();

  useEffect(() => {
    setExceptionDepartmentData(departments.filter((dept) => dept.costingDepartmentTypeException !== undefined && dept.costingDepartmentTypeException !== null));
  }, [departments]);

  const handleAddRow = () => {
    const newDept: IDepartment = newDepartment();
    if (exceptionDepartmentData !== undefined) {
      const updatedDepartExceptions = [newDept].concat(exceptionDepartmentData);
      setExceptionDepartmentData(updatedDepartExceptions);
    }
  };

  const handleDelete = (departmentId: number) => {
    const departmentsToDelete = [departmentId].concat(deletedExceptions);
    setDeletedExceptions(departmentsToDelete);
    const updatedExceptionList = exceptionDepartmentData.filter((dept) => dept !== null && dept.departmentId !== departmentId);
    setExceptionDepartmentData(updatedExceptionList);
  };

  const filterDepartments = (cellValue: number, filterValue: string) => {
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

  const getExceptionTypeOptions = (departmentType: string) => {
    let items: ICostingDepartmentExceptionType[];
    switch (departmentType) {
      case DepartmentTypeEnum.Revenue:
        items = [
          { text: ExceptionNameEnum.RevenueToExcluded, value: ExceptionTypeEnum.RevenueToExcluded },
          { text: ExceptionNameEnum.RevenueToOverhead, value: ExceptionTypeEnum.RevenueToOverhead },
          { text: ExceptionNameEnum.OverheadToExcluded, value: ExceptionTypeEnum.OverheadToExcluded },
          { text: ExceptionNameEnum.ExcludedToOverhead, value: ExceptionTypeEnum.ExcludedToOverhead }
        ];
        break;
      case DepartmentTypeEnum.Overhead:
        items = [
          { text: ExceptionNameEnum.RevenueToExcluded, value: ExceptionTypeEnum.RevenueToExcluded },
          { text: ExceptionNameEnum.OverheadToRevenue, value: ExceptionTypeEnum.OverheadToRevenue },
          { text: ExceptionNameEnum.OverheadToExcluded, value: ExceptionTypeEnum.OverheadToExcluded },
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

  const handleDepartmentChange = (newDepartmentId: number, oldDepartment: IDepartment) => {
    // Can't add exception if there is already an exception
    // Dropdown should prevent this from happening?
    if (exceptionDepartmentData.find((d) => d.departmentId === newDepartmentId)) {
      return;
    }
    // Get selected department
    const selectedDepartment = departments.find((d) => d.departmentId === newDepartmentId);
    if (selectedDepartment) {
      const updatedExceptionDepartments = [selectedDepartment].concat(exceptionDepartmentData).filter((d) => d.departmentId !== oldDepartment.departmentId);
      setExceptionDepartmentData(updatedExceptionDepartments);
      //add to updated exceptions
      if (!updatedExceptions.includes(selectedDepartment)) {
        const exceptionsToUpdate = [selectedDepartment].concat(updatedExceptions);
        setUpdatedExceptions(exceptionsToUpdate);
      }
    }
  };

  const handleExceptionTypeChange = (selectedExceptionTypeValue: number, department: IDepartment) => {
    const exceptionOptions = getExceptionTypeOptions(department.departmentType);
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
      //add to updated exceptions
      const updateIndex = updatedExceptions.findIndex((dept) => dept.departmentId === department.departmentId);
      if (updateIndex > -1) {
        updatedExceptions.splice(updateIndex, 1);
      }
      updatedExceptions.push(...updatedExceptionDepartments.filter((x) => x.departmentId === department.departmentId));
      setUpdatedExceptions(updatedExceptions);
    }
  };

  const handleCancel = () => {
    if (updatedExceptions.length > 0 || deletedExceptions.length > 0) {
      Modal.confirm({
        title: 'Discard unsaved changes?',
        okText: 'Discard Changes',
        cancelText: 'Keep Changes',
        onOk() {
          if (exceptionDepartmentData) {
            setUpdatedExceptions([]);
            setDeletedExceptions([]);
            setExceptionDepartmentData(departments.filter((dept) => dept.costingDepartmentTypeException !== undefined && dept.costingDepartmentTypeException !== null));
          }
          Toast.show({
            message: 'Changes discarded'
          });
        }
      });
    }
  };

  const handleSave = async () => {
    if (await validateStatisticDrivers()) {
      const saveExceptions = updatedExceptions.filter((dept) => !deletedExceptions.includes(dept.departmentId));
      // Don't actually save if there are no changes
      if (!saveExceptions.length && !deletedExceptions.length) {
        Toast.show({
          toastType: 'info',
          message: 'No changes to save'
        });
        return;
      }

      try {
        setLoading(true);
        //refresh stat drivers from return
        const departmentExceptions = await departmentCategorizationService.saveDepartementExceptions(updatedExceptions, deletedExceptions);
        setExceptionDepartmentData(departmentExceptions);
        setExceptionDepartmentData(departmentExceptions.filter((dept) => dept.costingDepartmentTypeException !== undefined && dept.costingDepartmentTypeException !== null));
        setUpdatedExceptions([]);
        setDeletedExceptions([]);
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

  const validateStatisticDrivers = async () => {
    if (!gridRef.current) {
      return false;
    }
    const invalidCells = await gridRef.current.validateGrid();

    if (invalidCells.length > 0) {
      const invalidKeys = invalidCells.map((cell) => cell.rowKey);
      const invalidRows: { rowNumber: number; departmentCode: string }[] = exceptionDepartmentData
        .map((dept, index) => {
          return { departmentCode: dept.departmentCode, rowNumber: index };
        })
        .filter((r) => invalidKeys.includes(r.departmentCode));

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
        dataKey='departmentCode'
        value={exceptionDepartmentData}
        loading={gridLoading}
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
              <DropDown //TODO change this to a server side search
                value={rowData.departmentId !== 0 ? rowData.departmentId : ''}
                onChange={(value) => handleDepartmentChange(value as number, rowData)}
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
            }
          ]}
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
                onChange={(value) => handleExceptionTypeChange(value as number, rowData)}
                items={getExceptionTypeOptions(rowData.departmentType)}
                itemValueField='value'
                itemTextField='text'
                value={rowData.costingDepartmentTypeException?.deptExceptionTypeName || ''}
              />
            </>
          )}
          validationRules={[
            {
              required: true
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
                <Button type='link' icon='Delete' onClick={() => handleDelete(rowData.departmentId)} />
              </Tooltip>
            </>
          )}
        />
      </DataGrid>
    </>
  );
};

export default DepartmentExceptions;
