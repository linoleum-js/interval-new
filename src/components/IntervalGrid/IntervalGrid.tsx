import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import { throttle } from 'lodash';

import IntervalList, { IIntervalListProps } from '../IntervalList/IntervalList';
import { IIntervalItemData } from '../IntervalItem/IntervalItem';

const msInDay = 24 * 60 * 60 * 1000; // one day
const stepSizeInMs = 5 * 60 * 1000; // 5 minutes
const numberOfSteps = msInDay / stepSizeInMs;

export interface IGridDimensions {
  stepSizeInMs: number;
  numberOfSteps: number;
  widthInPixels: number;
  stepSizeInPixels: number;
}

export interface IIntervalGridProps {
  list: Array<IIntervalItemData>;
}

const IntervalGrid = (props: IIntervalGridProps) => {
  const { list } = props;
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
      stepSizeInPixels
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

  console.log(gridDimensions.stepSizeInPixels);

  return <div
    ref={wrapperElement}
  >
    <IntervalList
      {...props}
      gridDimensions={gridDimensions}
    />
  </div>
};

export default IntervalGrid;