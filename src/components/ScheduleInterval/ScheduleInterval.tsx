
import React, { CSSProperties } from 'react';
import { useSelector } from 'react-redux';

import ScheduleIntervalHandle from '../ScheduleIntervalHandle/ScheduleIntervalHandle';
import { Direction } from '@models/Direction';
import { MovementData } from '@models/MovementData';
import { ScheduleIntervalData } from '@models/ScheduleIntervalData';
import { IUiState } from '@redux/uiState/uiStateStore';
import { IAppState } from '@redux/store';
import { stepSizeInMs, scheduleLength } from '@constants/constants';
import { activityColor } from '@constants/schedule';

import css from './ScheduleInterval.module.css';

export interface IScheduleIntervalProps {
  data: ScheduleIntervalData;
  onChange: (data: ScheduleIntervalData) => void;
}

const ScheduleInterval = (props: IScheduleIntervalProps) => {
  const uiState: IUiState = useSelector((state: IAppState) =>
    state.uiState
  );
  const { data, onChange } = props;
  const { start, end, type, id } = data;
  const { stepSizeInPixels } = uiState;

  const toPixels = (value: number): number => {
    return value / stepSizeInMs * stepSizeInPixels;
  };

  const style: CSSProperties = {
    left: toPixels(start),
    width: toPixels(end - start),
    backgroundColor: activityColor[type],
  };

  const onResizeLeft = (movementData: MovementData) => {
    const { distanceInSteps, direction } = movementData;
    const distanceInMs: number = distanceInSteps * stepSizeInMs;
    let newStart: number;
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

    onChange({ ...data, start: newStart });
  };

  const onResizeRight = (movementData: MovementData) => {
    const { distanceInSteps, direction } = movementData;
    const distanceInMs: number = distanceInSteps * stepSizeInMs;
    let newEnd: number;
    if (direction === Direction.Right) {
      newEnd = end + distanceInMs;
      if (newEnd > scheduleLength) {
        newEnd = newEnd;
      }
    } else {
      newEnd = end - distanceInMs;
      if (newEnd < start + stepSizeInMs) { 
        newEnd = start + stepSizeInMs;
      }
    }

    onChange({ ...data, end: newEnd });
  };

  return <div
    className={css.ScheduleInterval}
    style={style}
  >
    <ScheduleIntervalHandle
      direction={Direction.Left}
      value={start}
      onMove={onResizeLeft}
    />
    <ScheduleIntervalHandle
      direction={Direction.Right}
      value={end}
      onMove={onResizeRight}
    />
  </div>;
};

export default ScheduleInterval;