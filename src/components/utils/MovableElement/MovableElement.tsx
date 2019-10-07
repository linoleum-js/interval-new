
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import { useThrottleCallback } from '@react-hook/throttle';

import { getMovementdata } from '@util/scheduleInputUtil';
import { MovementData } from '@models/MovementData';
import { IUiState } from '@redux/uiState/uiStateStore';
import { IAppState } from '@redux/store';

export interface MovableElementProps {
  onMove: (data: MovementData) => void;
  onMoveEnd: () => void;
}

export function movableElement<T extends MovableElementProps> (
  Component: React.JSXElementConstructor<T>
) {
  return function MovableElement (props: T) {
    const uiState: IUiState = useSelector((state: IAppState) =>
      state.uiState
    );
    const { stepSizeInPixels } = uiState;
    const { onMove, onMoveEnd } = props;
    const [staticData] = useState({
      isDragging: false,
      lastX: 0
    });
    
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
        pageX, staticData.lastX, stepSizeInPixels
      );
      const { distanceInSteps, lastX } = movementData;

      if (distanceInSteps) {
        staticData.lastX = lastX;
        onMove(movementData);
      }
    };

    const throttledMouseMove = useThrottleCallback(onMouseMove, 150);

    useEffect(() => {
      document.addEventListener('mousemove', throttledMouseMove);
      document.addEventListener('pointerup', onDragEnd);
      return () => {
        document.removeEventListener('mousemove', throttledMouseMove);
        document.removeEventListener('pointerup', onDragEnd);
      };
    });

    
    return <div
      onPointerDown={onDragStart}
    >
      <Component {...props} />
    </div>;
  };
};