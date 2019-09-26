import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findIndex, isEqual, find } from 'lodash';

import ScheduleInterval from '../ScheduleInterval/ScheduleInterval';
import { ScheduleIntervalData } from '@models/ScheduleIntervalData';
import { IAppState } from '@redux/store';
import { IUiState } from '@redux/uiState/uiStateStore';
import { MovementData } from '@models/MovementData';
import { IScheduleData } from '@models/IScheduleData';

import { updateSchedule } from '@redux/scheduleLists/ScheduleListsStore';

import css from './ScheduleInput.module.css';
import { stepSizeInMs, scheduleLength, intervalMinWidth } from '@constants/constants';

export interface IScheduleInputProps {
  data: IScheduleData;
  id: string;
}

const ScheduleInput = (props: IScheduleInputProps) => {
  const { id, data } = props;
  const uiState: IUiState = useSelector((state: IAppState) => state.uiState);
  const { list } = data;
  const dispatch: Function = useDispatch();
  const [localList, setLocalList] = useState(list);
  const [itemInFocus, setItemInFocus] = useState<string | null>(null);
  const domNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We don't want to update store every time anything changes,
    // because it would make the undo/redo implementation not trivial.
    // So we better off keeping a local copy of the data while user is
    // dragging stuff around, and then dispatch only when it's done
    // (on MouseUp or PointerUp events, see onChangeFinish)
    setLocalList(list);
  }, []);

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
      ...data,
      list: localList
    }));
  };

  const onResizeLeft = (movementData: MovementData, intervalId: string) => {
    setLocalList((localList) => {
      const interval = find(localList, { id: intervalId })!;
      const { diffInMs } = movementData;
      const { start, end } = interval;
      let newStart = start + diffInMs;
      if (newStart < 0) {
        newStart = 0;
      } else if (newStart > end - stepSizeInMs) {
        newStart = end - stepSizeInMs;
      }
      onIntervalChange({ ...interval, start: newStart });
      return localList;
    });
  };

  const onResizeRight = (movementData: MovementData, intervalId: string) => {
    setLocalList((localList) => {
      const interval = find(localList, { id: intervalId })!;
      const { diffInMs } = movementData;
      const { end, start } = interval;
      let newEnd = end + diffInMs;
      if (newEnd > scheduleLength) {
        newEnd = scheduleLength;
      } else if (newEnd < start + stepSizeInMs) {
        newEnd = start + stepSizeInMs;
      }
      onIntervalChange({ ...interval, end: newEnd });
      return localList;
    });
  };

  const onIntervalMove = (movementData: MovementData, intervalId: string) => {
    setLocalList((localList) => {
      const interval = find(localList, { id: intervalId })!;
      const { diffInMs } = movementData;
      const { end, start } = interval;

      let newEnd = end + diffInMs;
      if (newEnd > scheduleLength) {
        newEnd = scheduleLength;
      } else if (newEnd < start + stepSizeInMs) {
        newEnd = start + stepSizeInMs;
      }
      
      let newStart = start + diffInMs;
      if (newStart < 0) {
        newStart = 0;
      } else if (newStart > end - stepSizeInMs) {
        newStart = end - stepSizeInMs;
      }
      
      onIntervalChange({ ...interval, start: newStart, end: newEnd });
      console.log('onIntervalMove');
      return localList;
    });
  };

  const onOutsideClick = (event: Event) => {
    const target = event.target as Node;
    if (domNode.current && !domNode.current.contains(target)) {
      setItemInFocus(null);
    }
  };

  useEffect(() => {
    document.addEventListener('pointerdown', onOutsideClick);
    return () => {
      document.removeEventListener('pointerdown', onOutsideClick);
    };
  });

  return <div
    className={css.ScheduleList}
    ref={domNode}
  >
    {localList.map((item: ScheduleIntervalData) => {
      return <ScheduleInterval
        key={item.id}
        data={item}
        onChangeFinish={onChangeFinish}
        intervalId={item.id}
        inputId={id}
        onResizeLeft={onResizeLeft}
        onResizeRight={onResizeRight}
        onMove={onIntervalMove}
        onFocus={setItemInFocus}
        isInFocus={itemInFocus === item.id}
      />;
    })}
  </div>;
};

export default ScheduleInput;