import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findIndex } from 'lodash';

import ScheduleInterval from '../ScheduleInterval/ScheduleInterval';
import { ScheduleIntervalData } from '@models/ScheduleIntervalData';
import { IAppState } from '@redux/store';
import { IUiState } from '@redux/uiState/uiStateStore';
import { IScheduleData } from '@models/IScheduleData';

import css from './ScheduleInput.module.css';
import { updateSchedule } from '@redux/scheduleLists/ScheduleListsStore';

export interface IScheduleInputProps {
  data: IScheduleData;
}

const ScheduleInput = (props: IScheduleInputProps) => {
  const { data } = props;
  const { list, id } = data;
  const uiState: IUiState = useSelector((state: IAppState) =>
    state.uiState
  );
  const dispatch: Function = useDispatch();
  const [localList, setLocalList] = useState(list);
  const listLength: number = list.length;

  useEffect(() => {
    setLocalList(list);
  }, list);

  const onIntervalChange = (intervalData: ScheduleIntervalData) => {
    const { start, end, type, id: intervalId } = intervalData;
    const changedDataIndex: number = findIndex(localList, { id: intervalId });
    let prevItems: ScheduleIntervalData[] = localList.slice(0, changedDataIndex);
    let nextItems: ScheduleIntervalData[] = localList.slice(changedDataIndex + 1);

    // If an interval item has changed, we have to update the previous
    // and next items.

    if (prevItems.length) {
      const lastItem: ScheduleIntervalData = prevItems.pop()!;
      // set the previous item's end where the current item's start is
      prevItems = [...prevItems, { ...lastItem, end: start }];
    }
    if (nextItems.length) {
      const firstItem: ScheduleIntervalData = nextItems.shift()!;
      // set the next item's end where the current item's end is
      nextItems = [{ ...firstItem, start: end }, ...nextItems];
    }

    setLocalList([...prevItems, intervalData, ...nextItems]);
  };

  const onChangeFinish = () => {
    dispatch(updateSchedule({
      id, list: localList
    }));
  };

  return <div className={css.ScheduleList}>
    {localList.map((item: ScheduleIntervalData) => {
      return <ScheduleInterval
        key={item.id}
        data={item}
        onChange={onIntervalChange}
        onChangeFinish={onChangeFinish}
      />;
    })}
  </div>;
};

export default ScheduleInput;