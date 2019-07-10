import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import { throttle } from 'lodash';

import RangeList, { IRangeListProps } from '../RangeList/RangeList';
import { IRangeItemData } from '../../models/IRangeItemData';

const msInDay = 24 * 60 * 60 * 1000; // one day
const stepSizeInMs = 5 * 60 * 1000; // 5 minutes
const numberOfSteps = msInDay / stepSizeInMs;

export interface IGridDimensions {
  stepSizeInMs: number;
  numberOfSteps: number;
  widthInPixels: number;
  stepSizeInPixels: number;
  msInDay: number;
}

export interface IGridProps {
  list: Array<IRangeItemData>;
}

const RangeGrid = (props: IGridProps) => {
  const wrapperElement = useRef<HTMLDivElement>(null);

  const getGridDimensions = () => {
    let widthInPixels = 0;
    if (wrapperElement.current) {
      widthInPixels = wrapperElement.current.clientWidth;
    }
    const stepSizeInPixels = widthInPixels / numberOfSteps;
    return {
      stepSizeInMs,
      numberOfSteps,
      widthInPixels,
      stepSizeInPixels,
      msInDay
    };
  };

  const [
    gridDimensions,
    setGridDimensions
  ] = useState<IGridDimensions>(getGridDimensions());

  const recalcGridDimensions = throttle(() => {
    const newGridData = getGridDimensions();
    if (gridDimensions.widthInPixels !== newGridData.widthInPixels) {
      setGridDimensions(newGridData);
    }
  }, 150);

  useEffect(() => recalcGridDimensions(), []);

  useEffect(() => {
    window.addEventListener('resize', recalcGridDimensions);
    return () => {
      window.removeEventListener('resize', recalcGridDimensions);
    };
  });

  return <div
    ref={wrapperElement}
  >
    <RangeList
      {...props}
      gridDimensions={gridDimensions}
    />
  </div>
};

export default RangeGrid;