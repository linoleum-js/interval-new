
import React, { StyleHTMLAttributes, CSSProperties } from 'react';

import css from './IntervalItem.module.css';
import { IGridDimensions } from '../IntervalGrid/IntervalGrid';
import { string } from 'prop-types';

export interface IIntervalItemData {
  start: number;
  end: number;
  type: number;
  id: string;
}

const colors: any = {
  1: 'red',
  2: 'green'
};

export interface IIntervalItemProps {
  data: IIntervalItemData;
  gridDimensions: IGridDimensions;
}

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
    backgroundColor: colors[type],
    height: 20
  };

  console.log('style', style);
  
  return <div
    className={css.IntervalItem}
    style={style}
  >
  </div>;
};

export default IntervalItem;