import React, { useContext, useEffect, useState } from 'react';
import Header from '@strata/tempo/lib/header';
import Button from '@strata/tempo/lib/button';
import Tooltip from '@strata/tempo/lib/tooltip';
import Tabs from '@strata/tempo/lib/tabs';
import Spacing from '@strata/tempo/lib/spacing';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid from '@strata/tempo/lib/datagrid';
import DropDown from '@strata/tempo/lib/dropdown';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import { IDepartmentCategorization } from './data/IDepartmentCategorization';
import { ICostingDepartmentTypeException } from './data/ICostingDepartmentTypeException';
import { CostConfigContext } from '../shared/data/CostConfigContext';
import _ from 'lodash';
import { IDepartment } from './data/IDepartment';

const DepartmentCategorization: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [deletedExceptions, setDeletedExceptions] = useState<number[]>([]);
  const [exceptionDepartmentData, setExceptionDepartmentData] = useState<IDepartment[]>([]);
  const [overheadDepartmentData, setOverheadDepartmentData] = useState<IDepartmentCategorization[]>([]);
  const [revenueDepartmentData, setRevenueDepartmentData] = useState<IDepartmentCategorization[]>([]);
  const { costConfig } = useContext(CostConfigContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentArray: IDepartment[] = [
          {
            departmentId: 20929,
            departmentCode: 'Commercial',
            description: 'Line of Business for Claims Costing',
            name: 'Commercial - Line of Business for Claims Costing',
            isClaimsCosting: 0,
            isHealthPlanAdmin: 0,
            departmentType: 'Revenue',
            costingDepartmentTypeException: null
          },
          {
            departmentId: 20841,
            departmentCode: '59 - 0101',
            description: 'FAMILY PRACTICE',
            name: '59 - 0101 - FAMILY PRACTICE',
            isClaimsCosting: 0,
            isHealthPlanAdmin: 0,
            departmentType: 'Revenue',
            costingDepartmentTypeException: {
              costingDepartmentExceptionTypeId: 665,
              departmentId: 20841,
              costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
              departmentTypeEnum: 1,
              costingDepartmentType: 'Revenue',
              deptExceptionTypeName: 'Revenue to Overhead',
              deptExceptionType: 1
            }
          },
          {
            departmentId: 50256,
            departmentCode: '08_10__20CAJS10___',
            description: '08_10__20 CLMS ADJ LN 20A S10___',
            name: '08_10__20CAJS10___ - 08_10__20 CLMS ADJ LN 20A S10___',
            isClaimsCosting: 0,
            isHealthPlanAdmin: 0,
            departmentType: 'Overhead',
            costingDepartmentTypeException: {
              costingDepartmentExceptionTypeId: 18326,
              departmentId: 50256,
              costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
              departmentTypeEnum: 2,
              costingDepartmentType: 'Overhead',
              deptExceptionTypeName: 'Overhead to Excluded',
              deptExceptionType: 3
            }
          },
          {
            departmentId: 50256,
            departmentCode: '08_10__20CAJS10___',
            description: '08_10__20 CLMS ADJ LN 20A S10___',
            name: '08_10__20CAJS10___ - 08_10__20 CLMS ADJ LN 20A S10___',
            isClaimsCosting: 0,
            isHealthPlanAdmin: 0,
            departmentType: 'Overhead',
            costingDepartmentTypeException: {
              costingDepartmentExceptionTypeId: 18326,
              departmentId: 50256,
              costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
              departmentTypeEnum: 2,
              costingDepartmentType: 'Overhead',
              deptExceptionTypeName: 'Overhead to Excluded',
              deptExceptionType: 3
            }
          },
          {
            departmentId: 1749,
            departmentCode: '8106006581',
            description: 'Aloha Dental Facility Maintenance-Dental',
            name: '08106006581 - Aloha Dental Facility Maintenance-Dental',
            isClaimsCosting: 0,
            isHealthPlanAdmin: 0,
            departmentType: 'Overhead',
            costingDepartmentTypeException: {
              costingDepartmentExceptionTypeId: 19810,
              departmentId: 1749,
              costingConfigGuid: '862a9552-8c68-4bae-b3fa-74454e7a9ecb',
              departmentTypeEnum: 2,
              costingDepartmentType: 'Overhead',
              deptExceptionTypeName: 'Overhead to Revenue',
              deptExceptionType: 2
            }
          }
        ];
        const exceptions: IDepartmentCategorization[] = [
          {
            departmentId: 20841,
            departmentTypeEnum: 0,
            costingDepartmentExceptionTypeId: 665,
            deptExceptionTypeName: 'Revenue to Overhead',
            deptExceptionType: 1,
            name: '59 - 0101 - FAMILY PRACTICE'
          }
        ];

        setDepartments(departmentArray);
        setExceptionDepartmentData(departmentArray.filter((dept) => dept.costingDepartmentTypeException !== null));
      } finally {
        setGridLoading(false);
      }
    };
    setGridLoading(true);
    fetchData();
  }, [costConfig]);
  const handleAddRow = () => {
    const newDepartment: IDepartment = {
      departmentId: 0,
      departmentCode: '',
      description: '',
      name: '',
      isClaimsCosting: 0,
      isHealthPlanAdmin: 0,
      departmentType: '',
      costingDepartmentTypeException: {
        costingDepartmentExceptionTypeId: 0,
        departmentId: 0,
        costingConfigGuid: '',
        departmentTypeEnum: 0,
        costingDepartmentType: '',
        deptExceptionTypeName: '',
        deptExceptionType: 0
      }
    };

    if (exceptionDepartmentData !== undefined) {
      const updatedDepartExceptions = [newDepartment].concat(exceptionDepartmentData);
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

  const renderExceptionTypeSwitch = (exceptionType: string) => {
    switch (exceptionType) {
      case 'Revenue':
        return [
          { text: 'Revenue to Excluded', value: 1 },
          { text: 'Revenue to Overhead', value: 2 },
          { text: 'Overhead to Excluded', value: 4 },
          { text: 'Excluded to Overhead', value: 5 }
        ];
      case 'Overhead':
        return [
          { text: 'Revenue to Excluded', value: 1 },
          { text: 'Overhead to Revenue', value: 3 },
          { text: 'Overhead to Excluded', value: 4 },
          { text: 'Excluded to Revenue', value: 6 }
        ];
      default:
        return [
          { text: 'Revenue to Excluded', value: 1 },
          { text: 'Revenue to Overhead', value: 2 },
          { text: 'Overhead to Revenue', value: 3 },
          { text: 'Overhead to Excluded', value: 4 },
          { text: 'Excluded to Overhead', value: 5 },
          { text: 'Excluded to Revenue', value: 6 }
        ];
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
            dataKey='costingDepartmentExceptionTypeId'
            value={exceptionDepartmentData}
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
            <DataGrid.Column
              header='Department'
              filter
              width={480}
              body={(rowData) => (
                <>
                  <DropDown
                    width={400}
                    showSearch
                    onSearch={_.debounce((search) => {
                      setSearchValue(true);
                      setSearchLoading(true);
                      //setSearchDepartments([]);

                      if (search.trim().length === 0) {
                        setSearchValue(false);
                        setSearchLoading(false);
                        return;
                      }
                      // start API simulation
                      setTimeout(() => {
                        if ('name'.indexOf(search.toLowerCase()) > -1) {
                          //setSearchDepartments([]);
                        }
                        setSearchLoading(false);
                      }, 1000);
                      // end API simulation
                    }, 500)}
                    onChange={() => {
                      // reset search when an option is selected
                      setTimeout(() => {
                        setSearchValue(false);
                        setSearchLoading(false);
                        //setSearchDepartments([]);
                      });
                    }}
                    items={departments}
                    itemTextField='name'
                    itemValueField='departmentId'
                    value={rowData.name}
                  ></DropDown>
                </>
              )}
            />
            <DataGrid.Column
              header='Exception Type'
              filter
              width={240}
              body={(rowData) => (
                <>
                  <DropDown
                    width={200}
                    items={renderExceptionTypeSwitch(rowData.costingDepartmentTypeException.costingDepartmentType)}
                    value={rowData.costingDepartmentTypeException.deptExceptionTypeName}
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
            <DataGrid.Column header='Department' filter width={480} />
            <DataGrid.EmptyColumn />
          </DataGrid>
        </Tabs.TabPane>
        <Tabs.TabPane key='3' tab='Revenue'>
          <DataGrid
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
            <DataGrid.Column header='Department' filter width={480} />
            <DataGrid.EmptyColumn />
          </DataGrid>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default DepartmentCategorization;
