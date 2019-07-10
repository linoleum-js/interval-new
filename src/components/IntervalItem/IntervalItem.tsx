
import React, { StyleHTMLAttributes, CSSProperties } from 'react';

import css from './IntervalItem.module.css';
import { IGridDimensions } from '../IntervalGrid/IntervalGrid';
import IntervalItemHandle from '../IntervalItemHandle/IntervalItemHandle';
import { Direction } from '../../models/Direction';

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
}

export const activityColor = {
  [ActivityType.Empty]: 'transparent',
  [ActivityType.Work]: 'rgb(72, 189, 84)',
  [ActivityType.Lunch]: 'rgb(255, 189, 72)',
  [ActivityType.Break]: 'rgb(255, 189, 72)',
};

const IntervalItem = (props: IIntervalItemProps) => {
  const { data, gridDimensions } = props;
  const { start, end, type } = data;
  const { stepSizeInPixels, stepSizeInMs } = gridDimensions;

  const toPixels = (value: number): number => {
    return value / stepSizeInMs * stepSizeInPixels;
  };

  const style: CSSProperties = {
    left: toPixels(start),
    width: toPixels(end - start),
    backgroundColor: activityColor[type],
  };

  return <div
    className={css.IntervalItem}
    style={style}
  >
    <IntervalItemHandle
      direction={Direction.Left}
      gridDimensions={gridDimensions}
      value={start}
      onResize={(data) => { console.log(data); }}
    />
    <IntervalItemHandle
      direction={Direction.Right}
      gridDimensions={gridDimensions}
      value={end}
      onResize={(data) => { console.log(data); }}
    />
  </div>;
};

export default IntervalItem;