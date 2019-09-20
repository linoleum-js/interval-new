
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import {useThrottle, useThrottleCallback} from '@react-hook/throttle';
// @ts-ignore
import {useDebounce, useDebounceCallback} from '@react-hook/debounce';

import { msToHHMM, getMovementdata } from '@util/util';
import { Direction } from '@models/Direction';
import { MovementData } from '@models/MovementData';
import { IUiState } from '@redux/uiState/uiStateStore';
import { IAppState } from '@redux/store';

import css from './ScheduleIntervalHandle.module.css';

export interface IScheduleIntervalHandleProps {
  direction: Direction;
  value: number;
  onMove: (data: MovementData) => void;
  onMoveEnd: () => void;
  id?: string;
}

const ScheduleIntervalHandle = (props: IScheduleIntervalHandleProps) => {
  const uiState: IUiState = useSelector((state: IAppState) =>
    state.uiState
  );
  const { stepSizeInPixels } = uiState;
  const { direction, value, onMove, onMoveEnd, id } = props;
  const [staticData] = useState({
    isDragging: false,
    lastX: 0,
    nextStepDone: 0
  });
  
  const getDirectionClassName = (): string => {
    return direction === Direction.Left ?
      css.ScheduleIntervalHandleLeft :
      css.ScheduleIntervalHandleRight;
  };

  const onDragEnd = () => {
    if (staticData.isDragging) {
      onMoveEnd();
    }
    staticData.isDragging = false;
  };

  const onDragStart = (event: React.PointerEvent) => {
    const { pageX } = event;

    staticData.lastX = pageX;
    staticData.isDragging = true;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!staticData.isDragging) {
      return;
    }

    const { pageX } = event;
    const movementData: MovementData = getMovementdata(
      pageX, staticData.lastX, stepSizeInPixels, staticData.nextStepDone
    );
    const { distanceInSteps, lastX, nextStepDone } = movementData;

    if (id === '2' && direction === Direction.Right) {
      // console.log('lastX', staticData.lastX, pageX);
    }
    staticData.nextStepDone = nextStepDone;
    if (distanceInSteps || true) {
      staticData.lastX = pageX;
      onMove(movementData);
    }
  };

  const throttledMouseMove = useThrottleCallback(onMouseMove, 1050);

  useEffect(() => {
    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('pointerup', onDragEnd);
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('pointerup', onDragEnd);
    };
  });

  return <div
    className={`${css.ScheduleIntervalHandle} ${getDirectionClassName()}`}
  >
    <div
      className={css.ScheduleIntervalHandleBody}
      onPointerDown={onDragStart}
    >
      {msToHHMM(value)}
    </div>
  </div>
};

export default ScheduleIntervalHandle;