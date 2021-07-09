import React from 'react';
import Drawer from '@strata/tempo/lib/drawer';
import Tree from '@strata/tempo/lib/tree';
import Button from '@strata/tempo/lib/button';
import Spacing from '@strata/tempo/lib/spacing';
import Input from '@strata/tempo/lib/input';
import Toggle from '@strata/tempo/lib/toggle';
import { IDrawerPickerType } from './enums/IDrawerPickerType';
import { useEffect } from 'react';
import DropDown from '@strata/tempo/lib/dropdown';
import Divider from '@strata/tempo/lib/divider';
import Text from '@strata/tempo/lib/text';

interface IDrawerPickerProps {
  visible: boolean;
  title: string;
  type: IDrawerPickerType;
  selectedValues: string[];
  onCancel: () => void;
  onSelect: (selectedData: string[]) => void;
}

const DrawerPicker: React.FC<IDrawerPickerProps> = (props: IDrawerPickerProps) => {
  const [loading, setLoading] = React.useState(false);
  const [treeData, setTreeData] = React.useState([]);
  const [selection, setSelection] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (props.type === IDrawerPickerType.Account) {
          console.log('acccount servier call');
        } else if (props.type === IDrawerPickerType.JobCode) {
          console.log('jobcode servier call');
        } else if (props.type === IDrawerPickerType.PayCode) {
          console.log('paycode servier call');
        }
        setTreeData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading, props]);

  const handleOnSelect = (selectValues: any) => {
    console.log('hitting on Select');
    //TODO: manipulate data and return back
    //props.onSelect()
    //can use selection in state?
  };

  const handleSubmit = () => {
    console.log('hitting submit');
    props.onSelect(selection);
  };

  const handleRollupChange = () => {
    console.log('hitting rollup change');
    //TODO: implement
  };

  //TODO: rename this somethign more descriptive?
  const handleToggleChange = () => {
    console.log('hitting toggle change');
    //TODO: implement
  };

  return (
    <>
      <Drawer
        title={props.title}
        visible={props.visible}
        width={400}
        footer={
          <>
            <Button onClick={props.onCancel}>Cancel</Button>
            <Button type='primary' onClick={handleSubmit}>
              Select
            </Button>
          </>
        }
        loading={loading}
        onClose={props.onCancel}
      >
        <Spacing itemSpacing={16} wrap={16} vAlign='center'>
          <Text strong={true}>Rollup</Text>
          <DropDown
            width={296}
            onChange={handleRollupChange}
            items={[
              { text: 'Rollup A', value: 1 },
              { text: 'Rollup B', value: 2 },
              { text: 'Rollup C', value: 3 },
              { text: 'Rollup D', value: 4 }
            ]}
          />
        </Spacing>
        <Divider margin={16} extended={true} />
        <Spacing padding={16} itemSpacing={12}>
          <Input search />
          <Toggle
            defaultValue={'all'}
            onChange={handleToggleChange}
            items={[
              { value: 'all', name: 'All' },
              { value: 'selected', name: 'Selected' }
            ]}
          />
        </Spacing>
        <Tree treeData={treeData} selectionMode='multiple' height={600} defaultCheckedKeys={props.selectedValues} onSelect={(selectedValues) => handleOnSelect(selectedValues)} />
      </Drawer>
    </>
  );
};

export default DrawerPicker;
