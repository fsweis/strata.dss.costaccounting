import React, { useState, useEffect, useContext } from 'react';
import DataGrid from '@strata/tempo/lib/datagrid';
import { CostingConfigContext } from '../shared/data/CostingConfigContext';
import ActionBar from '@strata/tempo/lib/actionbar';
import Button from '@strata/tempo/lib/button';
import Tooltip from '@strata/tempo/lib/tooltip';

const AccountOverrides: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { costingConfig } = useContext(CostingConfigContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!costingConfig) {
        return;
      }
      try {
        setIsLoading(true);
        // TODO: Load grid data here
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [costingConfig]);

  return (
    <>
      <ActionBar
        actions={
          <>
            <Button icon='Plus'>Add Override</Button>
            <Button icon='Download'>Export</Button>
            <Button icon='Upload'>Import</Button>
          </>
        }
      />
      <DataGrid
        scrollable
        loading={isLoading}
        value={[]}
        pager={{
          pageSize: 100
        }}
      >
        <DataGrid.NumberColumn field='sequence' header='Sequence' filter width={100} />
        <DataGrid.Column field='department' header='Department' filter width={240} />
        <DataGrid.Column field='account' header='Account' filter width={200} />
        <DataGrid.Column field='costComponent' header='Cost Component' filter width={240} />
        <DataGrid.NumberColumn format='percentDecimal' field='percentage' header='Percentage' editable filter width={120} />
        <DataGrid.TextAreaColumn field='comment' header='Comment' editable filter width={240} />
        <DataGrid.EmptyColumn />
        <DataGrid.Column
          align='right'
          width={80}
          body={(rowData) => (
            <>
              <Tooltip title='Delete'>
                <Button type='link' icon='Delete' />
              </Tooltip>
            </>
          )}
        />
      </DataGrid>
    </>
  );
};

export default AccountOverrides;
