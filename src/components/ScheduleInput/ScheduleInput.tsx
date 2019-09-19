import React from 'react';
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
  const uiState: IUiState = useSelector((state: IAppState) =>
    state.uiState
  );
  const dispatch: Function = useDispatch();
  const { data } = props;
  const { list, id } = data;
  const listLength: number = list.length;

  const onIntervalChange = (intervalData: ScheduleIntervalData) => {
    const { start, end, type, id: intervalId } = intervalData;
    const changedDataIndex: number = findIndex(list, { id: intervalId });
    let prevItems: ScheduleIntervalData[] = list.slice(0, changedDataIndex);
    let nextItems: ScheduleIntervalData[] = list.slice(changedDataIndex + 1);

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
      nextItems = [...nextItems, { ...firstItem, start: end }];
    }
    dispatch(updateSchedule({
      id, list: [...prevItems, intervalData, ...nextItems]
    }));
  };

  return <div className={css.ScheduleList}>
    {list.map((item: ScheduleIntervalData) => {
      return <ScheduleInterval
        key={item.id}
        data={item}
        onChange={onIntervalChange}
      />;
    })}
  </div>;
};

export default ScheduleInput;