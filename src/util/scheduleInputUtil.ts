import { MovementData } from '@models/MovementData';
import { Direction } from '@models/Direction';
import { IScheduleData } from '@models/IScheduleData';
import { ScheduleIntervalData } from '@models/ScheduleIntervalData';
import { ActivityType } from '@models/ActivityType';
import { scheduleLength, stepSizeInMs } from '@constants/constants';
import { findIndex, isEqual, find, last } from 'lodash';

export const pad2 = (value: string): string => {
  return value.length === 2 ? value : `0${value}`;
};

const msInMinute = 60 * 1000;

export const msToHHMM = (timeMs: number): string => {
  const totalMinutes = timeMs / msInMinute;
  const hours: string = String(Math.floor(totalMinutes / 60));
  const minutes: string = String(Math.floor(totalMinutes % 60));
  return `${pad2(hours)}:${pad2(minutes)}`;
};

export const getMovementdata = (x1: number, x0: number, step: number): MovementData => {
  const diff: number = x1 - x0;
  const distance: number = Math.abs(diff);
  const sign: number = Math.sign(diff);
  const distanceInSteps: number = Math.floor(distance / step);
  const direction: Direction = diff > 0 ? Direction.Right : Direction.Left;
  const nextStepDone: number = distance % step;
  const lastX = x1 - sign * nextStepDone;
  const diffInMs = sign * distanceInSteps * stepSizeInMs;

  return {
    nextStepDone,
    direction,
    distanceInSteps,
    diffInMs,
    lastX
  };
};

export const fillScheduleWithEmpty = (data: IScheduleData): IScheduleData => {
  const { list } = data;
  const newList: ScheduleIntervalData[] = [];

  list.forEach((item: ScheduleIntervalData, index: number) => {
    
    if (index === 0) {
      if (item.start !== 0) {
        newList.push(new ScheduleIntervalData(0, item.end, ActivityType.Empty));
      }
    } else {
      const prev: ScheduleIntervalData = list[index - 1];
      if (prev.end !== item.start) {
        newList.push(new ScheduleIntervalData(prev.end, item.start, ActivityType.Empty));
      }
    }
    newList.push(item);
  });

  const lastItem: ScheduleIntervalData = newList[newList.length - 1];
  if (lastItem.end !== scheduleLength) {
    newList.push(new ScheduleIntervalData(lastItem.end, scheduleLength, ActivityType.Empty));
  }

  return {
    ...data,
    list: newList
  };
};

export const addEmptyBoundaries = (data: IScheduleData): IScheduleData => {
  const { list } = data;
  const newList: ScheduleIntervalData[] = [...list];

  const first = list[0];
  if (first.start !== 0) {
    newList.unshift(new ScheduleIntervalData(0, first.start, ActivityType.Empty));
  }
  const last = list[list.length - 1];
  if (last.end !== scheduleLength) {
    newList.push(new ScheduleIntervalData(last.end, scheduleLength, ActivityType.Empty));
  }
  return {
    ...data,
    list: newList
  };
};


export const collapseSameType = (
  list: ScheduleIntervalData[], changedItemId?: string
): ScheduleIntervalData[] => {

  const newList: ScheduleIntervalData[] = [];
  let prevType: ActivityType | null = null;
  list.forEach((item: ScheduleIntervalData) => {
    const { type, end, id } = item;
    if (type === prevType) {
      const lastItem = last(newList)!;
      lastItem.end = end;
      if (changedItemId && changedItemId === id) {
        lastItem.id = changedItemId;
      }
    } else {
      newList.push(item);
      prevType = type;
    }
  });
  return newList;
};

export const generateIds = (data: IScheduleData): IScheduleData => {
  const { list } = data;
  let newList: ScheduleIntervalData[] = [];

  newList = list.map((item: ScheduleIntervalData) => {
    const { start, end, type } = item;
    return new ScheduleIntervalData(start, end, type);
  });

  return {
    ...data,
    list: newList
  };
};