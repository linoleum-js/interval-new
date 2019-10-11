import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findIndex, isEqual, find, last } from 'lodash';

import ScheduleInterval from '../ScheduleInterval/ScheduleInterval';
import { ScheduleIntervalData } from '@models/ScheduleIntervalData';
import { IAppState } from '@redux/store';
import { IUiState } from '@redux/uiState/uiStateStore';
import { MovementData } from '@models/MovementData';
import { IScheduleData } from '@models/IScheduleData';
import { ActivityType } from '@models/ActivityType';
import { Direction } from '@models/Direction';
import { collapseSameType } from '@util/scheduleInputUtil';

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
  const [localList, setLocalList] = useState<ScheduleIntervalData[]>(list);
  const [itemInFocus, setItemInFocus] = useState<string | null>(null);
  const [itemMenuOpen, setItemMenuOpen] = useState<string | null>(null);
  const domNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We don't want to update store every time anything changes,
    // because it would make the undo/redo implementation not trivial.
    // So we better off keeping a local copy of the data while user is
    // dragging stuff around, and then dispatch only when it's done
    // (on MouseUp or PointerUp events, see onChangeFinish)
    setLocalList(list);
  }, [list]);

  const atLeastMinWidth = (interval: ScheduleIntervalData): boolean => {
    const { start, end } = interval;
    return end - start >= stepSizeInMs;
  };

  const onIntervalChange = (intervalData: ScheduleIntervalData) => {
    let { start, end, type, id: intervalId } = intervalData;
    const changedDataIndex: number = findIndex(localList, { id: intervalId });
    let prevItems: ScheduleIntervalData[] = localList.slice(0, changedDataIndex);
    let nextItems: ScheduleIntervalData[] = localList.slice(changedDataIndex + 1);

    if (prevItems.length) {
      let prevItem: ScheduleIntervalData = prevItems.pop()!;
      if (!atLeastMinWidth(prevItem)) {
        let newPrevItem = prevItems.pop();
        if (!newPrevItem) {
          start = 0;
          prevItems = [];
        } else {
          prevItems = [...prevItems, { ...newPrevItem, end: start }];
        }
      } else {
        prevItems = [...prevItems, { ...prevItem, end: start }];
      }
    }

    if (nextItems.length) {
      let nextItem: ScheduleIntervalData = nextItems.shift()!;
      if (!atLeastMinWidth(nextItem)) {
        let newNextItem = nextItems.shift();
        if (!newNextItem) {
          end = scheduleLength;
          nextItems = [];
        } else {
          nextItems = [{ ...newNextItem, start: end }, ...nextItems];
        }
      } else {
        nextItems = [{ ...nextItem, start: end }, ...nextItems];
      }
    }

    const newList: ScheduleIntervalData[] = collapseSameType(
      [...prevItems, intervalData, ...nextItems], intervalId
    );

    setLocalList(newList);
  };

  const onResizeLeft = (movementData: MovementData, intervalId: string) => {
    setLocalList((localList) => {
      const interval: ScheduleIntervalData = find(localList, { id: intervalId })!;
      const { diffInMs } = movementData;
      const { start, end } = interval;
      let newStart: number = start + diffInMs;
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
      const interval: ScheduleIntervalData = find(localList, { id: intervalId })!;
      const { diffInMs } = movementData;
      const { end, start } = interval;
      let newEnd: number = end + diffInMs;
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
      const interval: ScheduleIntervalData = find(localList, { id: intervalId })!;
      const { diffInMs } = movementData;
      const { end, start } = interval;

      let newEnd: number = end + diffInMs;
      let newStart: number = start + diffInMs;

      if (newEnd > scheduleLength) {
        const diff: number = newEnd - scheduleLength;
        newEnd = scheduleLength;
        newStart -= diff;
      }
      
      if (newStart < 0) {
        const diff: number = newStart;
        newStart = 0;
        newEnd -= diff
      }
      
      onIntervalChange({ ...interval, start: newStart, end: newEnd });
      return localList;
    });
  };

  const onChangeFinish = () => {
    dispatch(updateSchedule({
      ...data,
      list: localList
    }));
  };

  const onOutsideClick = (event: Event) => {
    const target: Node = event.target as Node;
    if (domNode.current && !domNode.current.contains(target)) {
      setItemInFocus(null);
      setItemMenuOpen(null);
    }
  };

  const onCreate = (intervalId: string, position: Direction) => {
    // creating left to the item
    const index: number = findIndex(localList, { id: intervalId });
    const prevItem: ScheduleIntervalData = localList[index - 1];
    const item: ScheduleIntervalData = localList[index];
    const { Work, Break, Lunch } = ActivityType;
    const types: ActivityType[] = [Work, Break, Lunch];
    const allowedType: ActivityType[] = types.filter((type) => {
      return (!prevItem || prevItem.type !== type) &&
        (!item || item.type !== type);
    });
    const newType: ActivityType = allowedType[0];
    const { start, end, type } = item;
    const halfWidth: number = Math.floor((end - start) / stepSizeInMs / 2) * stepSizeInMs;
    const middle: number = start + halfWidth;
    let newItems: ScheduleIntervalData[] = [];
    if (position === Direction.Left) {
      newItems = [
        new ScheduleIntervalData(start, middle, newType),
        new ScheduleIntervalData(middle, end, type)
      ];
    } else {
      newItems = [
        new ScheduleIntervalData(start, middle, type),
        new ScheduleIntervalData(middle, end, newType)
      ];
    }
    const newList: ScheduleIntervalData[] = [
      ...localList.slice(0, index),
      ...newItems,
      ...localList.slice(index + 1)
    ];
    dispatch(updateSchedule({
      ...data,
      list: newList
    }));
  };

  const onRemove = (id: string) => {
    const newList = localList.filter((item) => item.id !== id);
    dispatch(updateSchedule({
      ...data,
      list: collapseSameType(newList)
    }));
  };

  const onTypeChange = (id: string, type: ActivityType) => {

  };

  const canCreateInside = (data: ScheduleIntervalData) => {
    const { start, end } = data;
    return end - start >= stepSizeInMs * 2;
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
        onMenuOpen={setItemMenuOpen}
        isInFocus={itemInFocus === item.id}
        isMenuOpen={itemMenuOpen === item.id}
        onRemove={onRemove}
        onCreate={onCreate}
        onTypeChange={onTypeChange}
        canCreateInside={canCreateInside(item)}
      />;
    })}
    {/* <div style={{ position: 'absolute' }}>{localList.length}</div> */}
  </div>;
};

export default ScheduleInput;