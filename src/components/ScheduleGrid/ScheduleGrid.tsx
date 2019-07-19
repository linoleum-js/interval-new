import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import { throttle } from 'lodash';

import ScheduleInput, { IScheduleInputProps } from '@components/ScheduleInput/ScheduleInput';
import { IScheduleItemData } from '@models/IScheduleItemData';
import { numberOfSteps, stepSizeInMs, msInDay } from '@constants/constants';
import ScheduleInputCollection from '../ScheduleInputCollection/ScheduleInputCollection';

export interface IGridDimensions {
  stepSizeInMs: number;
  numberOfSteps: number;
  widthInPixels: number;
  stepSizeInPixels: number;
  msInDay: number;
}

export interface IGridProps {
}

const ScheduleGrid = (props: IGridProps) => {
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
    <ScheduleInputCollection />
  </div>
};

export default ScheduleGrid;