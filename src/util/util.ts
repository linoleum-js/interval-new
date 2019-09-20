import { MovementData } from '@models/MovementData';
import { Direction } from '@models/Direction';
import { IScheduleData } from '@models/IScheduleData';
import { ScheduleIntervalData } from '@models/ScheduleIntervalData';
import { ActivityType } from '@models/ActivityType';
import { scheduleLength } from '@constants/constants';

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

export const getMovementdata = (x1: number, x0: number, step: number, nextStepDone: number): MovementData => {
  const diff: number = x1 - x0;
  const distance: number = Math.abs(diff);
  // const distanceInSteps: number = Math.floor(distance / step);
  const distanceInSteps: number = distance;
  const direction: Direction = diff > 0 ? Direction.Right : Direction.Left;
  // let newNextStepDone: number = distance % step;
  let newNextStepDone: number = 0;
  newNextStepDone = direction === Direction.Right ?
    newNextStepDone:
    -newNextStepDone;
  // const newLastX = x1;

  return {
    nextStepDone: newNextStepDone,
    direction,
    distanceInSteps,
    lastX: x1
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