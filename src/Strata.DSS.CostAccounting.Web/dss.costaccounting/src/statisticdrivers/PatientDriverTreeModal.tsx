import React from 'react';
import Spacing from '@strata/tempo/lib/spacing';
import Button from '@strata/tempo/lib/button';
import Modal from '@strata/tempo/lib/modal';
import Input from '@strata/tempo/lib/input';
import Tree, { ITreeNode, Key } from '@strata/tempo/lib/tree';
import { IStatisticDriver } from './data/IStatisticDriver';
import { useEffect, useState, ChangeEvent } from 'react';
import cloneDeep from 'lodash/cloneDeep';

export interface IPatientDriverTreeModalProps {
  statDrivers: IStatisticDriver[];
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const PatientDriverTreeModal: React.FC<IPatientDriverTreeModalProps> = (props: IPatientDriverTreeModalProps) => {
  // Mmove all this logic into its own component for the run patient drivers modal
  const [patientDriversToRun, setPatientDriversToRun] = useState<Key[]>([]);
  const [patientDriversSearch, setPatientDriversSearch] = useState('');
  const [patientDriverTreeData, setPatientDriverTreeData] = useState<ITreeNode[]>([]);
  const [patientDriverTree, setPatientDriverTree] = useState<ITreeNode[]>([]);
  const [patientDriverTreeOkText, setPatientDriverTreeOkText] = useState<string>('');

  useEffect(() => {
    const runPatientDriverTreeChildren = props.statDrivers.map((statDriver) => {
      return { key: statDriver.driverConfigGuid, title: statDriver.name };
    });

    const runPatientDriverTree = [
      {
        key: 'AllPatientKey',
        title: 'All Patient Drivers',
        children: runPatientDriverTreeChildren
      }
    ];
    setPatientDriverTree(runPatientDriverTree);
  }, [props]);

  //patient driver tree search
  useEffect(() => {
    const searchValue = (value: string | undefined) => {
      const s = patientDriversSearch.toLowerCase();
      return value?.toLowerCase().includes(s);
    };
    const filterData = (data: ITreeNode[]) => {
      const filteredData = cloneDeep(data);
      return filteredData.filter((f) => {
        f.children = f.children?.filter((c) => searchValue(c.title?.toString()));
        return searchValue(f.title?.toString()) || f.children?.find((c) => searchValue(c.title?.toString()));
      });
    };
    if (patientDriversSearch !== '') {
      setPatientDriverTreeData(filterData(patientDriverTree));
    } else {
      setPatientDriverTreeData(patientDriverTree);
    }
  }, [patientDriversSearch, patientDriverTree]);

  useEffect(() => {
    switch (patientDriversToRun.length) {
      case 0:
        setPatientDriverTreeOkText('Run Drivers');
        break;
      case 1:
        setPatientDriverTreeOkText('Run 1 Driver');
        break;
      default:
        setPatientDriverTreeOkText('Run ' + patientDriversToRun.length + ' Drivers');
    }
  }, [patientDriversToRun]);

  const handleCancel = () => {
    setPatientDriversSearch('');
    props.onCancel();
  };

  const handleOk = () => {
    setPatientDriversSearch('');
    props.onOk();
  };

  return (
    <>
      <Modal
        title='Run Patient Drivers'
        visible={props.visible}
        onCancel={handleCancel}
        onOk={handleOk}
        okText='Run Drivers'
        removeBodyPadding
        footer={
          <Spacing hAlign='right'>
            <Button type='secondary' onClick={handleCancel}>
              Cancel
            </Button>
            <Button type='primary' onClick={handleOk} disabled={patientDriversToRun.length === 0}>
              {patientDriverTreeOkText}
            </Button>
          </Spacing>
        }
      >
        <Spacing padding={16} itemSpacing={12}>
          <Input search onChange={(event: ChangeEvent<HTMLInputElement>) => setPatientDriversSearch(event.target.value)} />
        </Spacing>
        <Tree
          treeData={patientDriverTreeData}
          selectionMode='multiple'
          height={400}
          defaultExpandedKeys={['AllPatientKey']}
          onCheck={(checkedKeys, info) => {
            const guids: string[] = checkedKeys.toString().split(',');
            setPatientDriversToRun(guids);
          }}
        />
      </Modal>
    </>
  );
};

export default PatientDriverTreeModal;
