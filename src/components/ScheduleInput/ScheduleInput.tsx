import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findIndex } from 'lodash';

import ScheduleInterval from '../ScheduleInterval/ScheduleInterval';
import { IScheduleIntervalData } from '@models/IScheduleIntervalData';
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

  const onIntervalChange = (intervalData: IScheduleIntervalData) => {
    const { start, end, type, id: intervalId } = intervalData;
    const changedDataIndex: number = findIndex(list, { id: intervalId });
    let prevItems: Array<IScheduleIntervalData> = list.slice(0, changedDataIndex);
    let nextItems: Array<IScheduleIntervalData> = list.slice(changedDataIndex + 1);

    // If an interval item has changed, we have to update the previous
    // and next items.

    if (prevItems.length) {
      const lastItem: IScheduleIntervalData = prevItems.pop()!;
      // set the previous item's end where the current item's start is
      prevItems = [...prevItems, { ...lastItem, end: start }];
    }
    if (nextItems.length) {
      const firstItem: IScheduleIntervalData = nextItems.shift()!;
      // set the next item's end where the current item's end is
      nextItems = [...nextItems, { ...firstItem, start: end }];
    }
    dispatch(updateSchedule({
      id, list: [...prevItems, intervalData, ...nextItems]
    }));
  };

  return <div className={css.ScheduleList}>
    {list.map((item: IScheduleIntervalData) => {
      return <ScheduleInterval
        key={item.id}
        data={item}
        onChange={onIntervalChange}
      />;
    })}
  </div>;
};

export default ScheduleInput;