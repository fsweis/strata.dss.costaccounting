import React from 'react';
import Header from '@strata/tempo/lib/header';
import Button from '@strata/tempo/lib/button';
import Tooltip from '@strata/tempo/lib/tooltip';
import Tabs from '@strata/tempo/lib/tabs';
import Spacing from '@strata/tempo/lib/spacing';
import ActionBar from '@strata/tempo/lib/actionbar';
import DataGrid from '@strata/tempo/lib/datagrid';
import DropDown from '@strata/tempo/lib/dropdown';
import ButtonMenu from '@strata/tempo/lib/buttonmenu';
import _ from 'lodash';

const DepartmentCategorization: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchItems, setSearchItems] = React.useState([]);
  const [data, setData] = React.useState([]);

  const handleAddRow = () => {
    //setData((data) => data.concat([{ id: data.length + 1, name: '', exceptionType: '' }]));
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
                      setSearchItems([]);

                      if (search.trim().length === 0) {
                        setSearchValue(false);
                        setSearchLoading(false);
                        return;
                      }
                      // start API simulation
                      setTimeout(() => {
                        if ('name'.indexOf(search.toLowerCase()) > -1) {
                          setSearchItems([]);
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
                        setSearchItems([]);
                      });
                    }}
                    items={searchItems}
                  ></DropDown>
                </>
              )}
            />
            <DataGrid.Column header='Exception Type' filter width={240} />

            <DataGrid.EmptyColumn />
            <DataGrid.Column
              align='right'
              width={144}
              body={(rowData) => (
                <>
                  <Tooltip placement='left' title={rowData.isUsed ? "Can't delete drivers in use" : 'Delete'}>
                    <Button type='link' icon='Delete' disabled={rowData.isUsed} />
                  </Tooltip>
                </>
              )}
            />
          </DataGrid>
        </Tabs.TabPane>
        <Tabs.TabPane key='2' tab='Overhead'>
          <Spacing padding={24}>Content with padding</Spacing>
        </Tabs.TabPane>
        <Tabs.TabPane key='3' tab='Revenue'></Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default DepartmentCategorization;
