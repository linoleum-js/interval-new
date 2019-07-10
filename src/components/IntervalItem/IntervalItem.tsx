
import React, { StyleHTMLAttributes, CSSProperties } from 'react';

import css from './IntervalItem.module.css';
import { IGridDimensions } from '../IntervalGrid/IntervalGrid';
import IntervalItemHandle from '../IntervalItemHandle/IntervalItemHandle';
import { Direction } from '../../models/Direction';
import { MovementData } from '../../models/MovementData';

export enum ActivityType {
  Empty,
  Work,
  Lunch,
  Break
}

export interface IIntervalItemData {
  start: number;
  end: number;
  type: ActivityType;
  id: string;
}

export interface IIntervalItemProps {
  data: IIntervalItemData;
  gridDimensions: IGridDimensions;
  onChange: (data: IIntervalItemData) => void;
}

export const activityColor = {
  [ActivityType.Empty]: 'transparent',
  [ActivityType.Work]: 'rgb(72, 189, 84)',
  [ActivityType.Lunch]: 'rgb(255, 189, 72)',
  [ActivityType.Break]: 'rgb(255, 189, 72)',
};

const IntervalItem = (props: IIntervalItemProps) => {
  const { data, gridDimensions } = props;
  const { start, end, type, id } = data;
  const { stepSizeInPixels, stepSizeInMs, msInDay } = gridDimensions;

  const toPixels = (value: number): number => {
    return value / stepSizeInMs * stepSizeInPixels;
  };

  const style: CSSProperties = {
    left: toPixels(start),
    width: toPixels(end - start),
    backgroundColor: activityColor[type],
  };

  const onResizeLeft = (movementData: MovementData) => {
    const { onChange } = props;
    const { distanceInSteps, direction } = movementData;
    const distanceInMs = distanceInSteps * stepSizeInMs;
    let newStart;
    if (direction === Direction.Left) {
      newStart = start - distanceInMs;
      if (newStart < 0) {
        newStart = 0;
      }
    } else {
      newStart = start + distanceInMs;
      if (newStart > end - stepSizeInMs) { 
        newStart = end - stepSizeInMs;
      }
    }

    onChange({
      ...data,
      start: newStart
    });
  };

  const onResizeRight = (movementData: MovementData) => {
    const { onChange } = props;
    const { distanceInSteps, direction } = movementData;
    const distanceInMs = distanceInSteps * stepSizeInMs;
    let newEnd;
    if (direction === Direction.Right) {
      newEnd = end + distanceInMs;
      if (newEnd > msInDay) {
        newEnd = newEnd;
      }
    } else {
      newEnd = end - distanceInMs;
      if (newEnd < start + stepSizeInMs) { 
        newEnd = start + stepSizeInMs;
      }
    }

    onChange({
      ...data,
      end: newEnd
    });
  };

  return <div
    className={css.IntervalItem}
    style={style}
  >
    <IntervalItemHandle
      direction={Direction.Left}
      gridDimensions={gridDimensions}
      value={start}
      onResize={onResizeLeft}
    />
    <IntervalItemHandle
      direction={Direction.Right}
      gridDimensions={gridDimensions}
      value={end}
      onResize={onResizeRight}
    />
  </div>;
};

export default IntervalItem;