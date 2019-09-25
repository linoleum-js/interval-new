import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findIndex, isEqual } from 'lodash';

import ScheduleInterval from '../ScheduleInterval/ScheduleInterval';
import { ScheduleIntervalData } from '@models/ScheduleIntervalData';
import { IAppState } from '@redux/store';
import { IUiState } from '@redux/uiState/uiStateStore';
import { IScheduleData } from '@models/IScheduleData';

import css from './ScheduleInput.module.css';
import { updateSchedule } from '@redux/scheduleLists/ScheduleListsStore';

export interface IScheduleInputProps {
  data: IScheduleData;
  id: string;
}

const ScheduleInput = (props: IScheduleInputProps) => {
  const { id } = props;
  // const { list, id } = data;
  const uiState: IUiState = useSelector((state: IAppState) =>
    state.uiState
  );
  
  
  const listState = useSelector((state: IAppState) =>
    state.scheduleLists, () => false
  );
  const { isLoading, list: stateList } = listState;
  const data = stateList.filter((item) => item.id === id)[0];
  const { list } = data;
  const dispatch: Function = useDispatch();
  const [localList, setLocalList] = useState(list);
  const listLength: number = list.length;
  // const localList = list;

  useEffect(() => {
    // We don't want to update store every time anything changes,
    // because it would make the undo/redo implementation not trivial.
    // So we better off keeping a local copy of the data while user is
    // dragging stuff around, and then dispatch only when it's done
    // (on MouseUp or PointerUp events, see onChangeFinish)
    setLocalList(list);
    console.log('setLocalList');
  }, []);

  const onIntervalChange = (intervalData: ScheduleIntervalData, oldData: any) => {
    const { start, end, type, id: intervalId } = intervalData;
    const changedDataIndex: number = findIndex(localList, { id: intervalId });
    const oldInterval = {...localList[changedDataIndex]};
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
    console.log('intervalData', oldData, intervalData);
    
    // dispatch(updateSchedule({
    //   ...data,
    //   list: [...prevItems, intervalData, ...nextItems]
    // }));
  };
  // console.log('state', localList[1]);

  const onChangeFinish = () => {
    dispatch(updateSchedule({
      ...data,
      list: localList
    }));
  };

  const onResizeLeft = (dx: number, intervalId: string) => {
    setLocalList((localList) => {
      const interval = localList.filter(({ id }) => id === intervalId)[0];
      const { start, end } = interval;
      let newStart = start + dx;
      onIntervalChange({ ...interval, start: newStart }, interval);
      return localList;
    });
  };

  const onResizeRight = (dx: number, intervalId: string) => {
    setLocalList((localList) => {
      const interval = localList.filter(({ id }) => id === intervalId)[0];
      const { start, end } = interval;
      let newEnd = end + dx;
      onIntervalChange({ ...interval, end: newEnd }, interval);
      return localList;
    });
  };

  return <div className={css.ScheduleList}>
    {localList.map((item: ScheduleIntervalData) => {
      return <ScheduleInterval
        key={item.id}
        data={item}
        onChange={onIntervalChange}
        onChangeFinish={onChangeFinish}
        intervalId={item.id}
        inputId={id}
      />;
    })}
  </div>;
};

export default ScheduleInput;