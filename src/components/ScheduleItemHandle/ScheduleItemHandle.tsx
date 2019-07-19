import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { msToHHMM, getMovementdata } from '@util/util';
import { IGridDimensions } from '../ScheduleGrid/ScheduleGrid';
import { Direction } from '@models/Direction';
import { MovementData } from '@models/MovementData';
import { IUiStateState } from '@redux/uiState/uiStateStore';
import { IAppState } from '@redux/store';

import css from './ScheduleItemHandle.module.css';

export interface IScheduleItemHandleProps {
  direction: Direction;
  value: number;
  onResize: (data: MovementData) => void;
}

const ScheduleItemHandle = (props: IScheduleItemHandleProps) => {
  const uiState: IUiStateState = useSelector((state: IAppState) =>
    state.uiState
  );
  const { direction, value } = props;
  const [a, setA] = useState(0);
  const [staticData, setStaticData] = useState({
    isDragging: false,
    lastX: 0
  });
  
  const getDirectionClassName = (): string => {
    return direction === Direction.Left ?
      css.ScheduleItemHandleLeft :
      css.ScheduleItemHandleRight;
  };

  const onPointerUp = () => {
    staticData.isDragging = false;
  };

  const onPointerDown = (event: React.PointerEvent) => {
    const { pageX } = event;
    // setStaticData({
    //   lastX: pageX,
    //   isDragging: true
    // });
    staticData.lastX = pageX;
    staticData.isDragging = true;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!staticData.isDragging) {
      return;
    }

    const { pageX } = event;
    const { onResize } = props;
    const { stepSizeInPixels } = uiState;
    const movementData: MovementData = getMovementdata(
      pageX, staticData.lastX, stepSizeInPixels
    );
    const { distanceInSteps, direction, lastX } = movementData;
    // staticData.lastX = lastX;

    if (distanceInSteps) {
      // setStaticData({
      //   isDragging: true,
      //   lastX: lastX
      // });
      staticData.lastX = lastX;
      onResize(movementData);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerup', onPointerUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  });

  return <div
    className={`${css.ScheduleItemHandle} ${getDirectionClassName()}`}
  >
    <div
      className={css.ScheduleItemHandleBody}
      onPointerDown={onPointerDown}
    >
      {msToHHMM(value)}
    </div>
    <div style={{ display: 'none' }}>{a}</div>
  </div>
};

export default ScheduleItemHandle;