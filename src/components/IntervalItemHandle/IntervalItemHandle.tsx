import React, { useEffect, useState } from 'react';

import { msToHHMM, getMovementdata } from '../../util/util';
import { IGridDimensions } from '../IntervalGrid/IntervalGrid';

import css from './IntervalItemHandle.module.css';
import { Direction } from '../../models/Direction';
import { MovementData } from '../../models/MovementData';

export interface IIntervalItemHandleProps {
  direction: Direction;
  gridDimensions: IGridDimensions;
  value: number;
  onResize: (data: MovementData) => void;
}

const IntervalItemHandle = (props: IIntervalItemHandleProps) => {
  const { direction, value } = props;
  const [a, setA] = useState(0);
  const [staticData, setStaticData] = useState({
    isDragging: false,
    lastX: 0
  });
  
  const getDirectionClassName = (): string => {
    return direction === Direction.Left ?
      css.IntervalItemHandleLeft :
      css.IntervalItemHandleRight;
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
    const { gridDimensions, onResize } = props;
    const { stepSizeInPixels } = gridDimensions;
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
    className={`${css.IntervalItemHandle} ${getDirectionClassName()}`}
  >
    <div
      className={css.IntervalItemHandleBody}
      onPointerDown={onPointerDown}
    >
      {msToHHMM(value)}
    </div>
    <div style={{ display: 'none' }}>{a}</div>
  </div>
};

export default IntervalItemHandle;