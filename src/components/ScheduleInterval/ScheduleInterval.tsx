
import React, { CSSProperties, useEffect, useRef, Ref } from 'react';
import { useSelector } from 'react-redux';

import ScheduleIntervalHandle from '../ScheduleIntervalHandle/ScheduleIntervalHandle';
import ScheduleIntervalBody from '../ScheduleIntervalBody/ScheduleIntervalBody';
import { Direction } from '@models/Direction';
import { MovementData } from '@models/MovementData';
import { ScheduleIntervalData } from '@models/ScheduleIntervalData';
import { ActivityType } from '@models/ActivityType';
import { IUiState } from '@redux/uiState/uiStateStore';
import { IAppState } from '@redux/store';
import { stepSizeInMs, scheduleLength } from '@constants/constants';
import { activityColor } from '@constants/schedule';

import css from './ScheduleInterval.module.css';

export interface IScheduleIntervalProps {
  data: ScheduleIntervalData;
  onChangeFinish: () => void;
  intervalId: string;
  inputId: string;
  onResizeLeft: (movementData: MovementData, id: string) => void;
  onResizeRight: (movementData: MovementData, id: string) => void;
  onMove: (movementData: MovementData, id: string) => void;
  onFocus: (id: string) => void;
  isInFocus: boolean;
}

const ScheduleInterval = (props: IScheduleIntervalProps) => {
  const uiState: IUiState = useSelector((state: IAppState) =>
    state.uiState
  );
  const { onChangeFinish, onFocus, isInFocus, onMove } = props;
  const { data } = props;

  const { start, end, type, id } = data;
  const isEmpty: boolean = type === ActivityType.Empty;
  const { stepSizeInPixels } = uiState;

  const toPixels = (value: number): number => {
    return value * stepSizeInPixels / stepSizeInMs;
  };
  
  const style: CSSProperties = {
    left: toPixels(start),
    width: toPixels(end - start),
    backgroundColor: activityColor[type],
  };

  const onResizeLeft = (movementData: MovementData) => {
    props.onResizeLeft(movementData, id);
  };

  const onResizeRight = (movementData: MovementData) => {
    props.onResizeRight(movementData, id);
  };

  const onBodyMove = (movementData: MovementData) => {
    onMove(movementData, id);
  };


  return <div
    className={css.ScheduleInterval}
    style={style}
    onPointerDown={() => onFocus(id)}
  >
    {!isEmpty && isInFocus &&
      <>
        <ScheduleIntervalHandle
          direction={Direction.Left}
          value={start}
          onMove={onResizeLeft}
          onMoveEnd={onChangeFinish}
        />
        <ScheduleIntervalHandle
          direction={Direction.Right}
          value={end}
          onMove={onResizeRight}
          onMoveEnd={onChangeFinish}
        />
      </>
    }
    {!isEmpty && 
      <ScheduleIntervalBody
        onMove={onBodyMove}
        onMoveEnd={onChangeFinish}
      />
    }
    
    {id}
  </div>;
};

export default ScheduleInterval;