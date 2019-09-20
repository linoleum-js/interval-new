
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
  onChange: (data: ScheduleIntervalData, prevData?: any) => void;
  onResizeLeft: (dx: number, id: string) => void;
  onResizeRight: (dx: number, id: string) => void;
  onChangeFinish: () => void;
  intervalId: string;
  inputId: string;
}

const ScheduleInterval = (props: IScheduleIntervalProps) => {
  const uiState: IUiState = useSelector((state: IAppState) =>
    state.uiState
  );
  const listState = useSelector((state: IAppState) =>
    state.scheduleLists, () => false
  );
  const { onChange, onChangeFinish, intervalId, inputId } = props;
  const { data } = props;
  const { list: inputs } = listState;
  const input = inputs.filter(({ id }) => id === inputId)[0];
  // const data = input.list.filter(({ id }) => id === intervalId)[0];

  const { start, end, type, id } = data;
  const { stepSizeInPixels } = uiState;

  // const toPixels = (value: number): number => {
  //   return value * stepSizeInPixels / stepSizeInMs;
  // };
  
  const toPixels = (value: number): number => {
    return value;
  };

  const style: CSSProperties = {
    left: toPixels(start),
    width: toPixels(end - start),
    backgroundColor: activityColor[type],
  };

  const onResizeLeft = (movementData: MovementData) => {
    const { distanceInSteps, direction } = movementData;
    // const distanceInMs: number = distanceInSteps * stepSizeInMs;
    const distanceInMs: number = distanceInSteps;
    let newStart: number;
    if (direction === Direction.Left) {
      newStart = start - distanceInMs;
      if (newStart < 0) {
        newStart = 0;
      }
    } else {
      newStart = start + distanceInMs;
      if (newStart > end - stepSizeInPixels) { 
        newStart = end - stepSizeInPixels;
      }
    }

    let dx = direction === Direction.Left ? -distanceInMs : distanceInMs;
    props.onResizeLeft(dx, id);
    // onChange({ ...data, start: newStart }, data);
  };

  const onResizeRight = (movementData: MovementData) => {
    const { distanceInSteps, direction } = movementData;
    // const distanceInMs: number = distanceInSteps * stepSizeInMs;
    const distanceInMs: number = distanceInSteps;
    
    let newEnd: number;
    if (direction === Direction.Right) {
      newEnd = end + distanceInMs;
      if (newEnd > scheduleLength) {
        newEnd = newEnd;
      }
    } else {
      newEnd = end - distanceInMs;
      if (newEnd < start + stepSizeInPixels) { 
        newEnd = start + stepSizeInPixels;
      }
    }

    let dx = direction === Direction.Left ? -distanceInMs : distanceInMs;
    props.onResizeRight(dx, id);
    // onChange({ ...data, end: newEnd }, data);
  };

  return <div
    className={css.ScheduleInterval}
    style={style}
  >
    <ScheduleIntervalHandle
      direction={Direction.Left}
      value={start}
      onMove={onResizeLeft}
      onMoveEnd={onChangeFinish}
    />
    {/* {id} */}
    <ScheduleIntervalHandle
      direction={Direction.Right}
      value={end}
      onMove={onResizeRight}
      onMoveEnd={onChangeFinish}
      id={id}
    />
  </div>;
};

export default ScheduleInterval;