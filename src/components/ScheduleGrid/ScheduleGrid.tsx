import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { throttle } from 'lodash';

import { numberOfSteps } from '@constants/constants';
import ScheduleInputCollection from '../ScheduleInputCollection/ScheduleInputCollection';
import { updateUiState, IUiState } from '@redux/uiState/uiStateStore';
import { IAppState } from '@redux/store';

export interface IGridProps {
}

const ScheduleGrid = (props: IGridProps) => {
  const wrapperElement = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const uiState: IUiState = useSelector((state: IAppState) =>
    state.uiState
  );

  const getGridDimensions = (): IUiState => {
    let widthInPixels: number = uiState.widthInPixels;
    if (wrapperElement.current) {
      widthInPixels = wrapperElement.current.clientWidth;
    }
    const stepSizeInPixels = widthInPixels / numberOfSteps;
    return {
      widthInPixels,
      stepSizeInPixels
    };
  };

  const recalcGridDimensions = throttle(() => {
    const newGridData: IUiState = getGridDimensions();
    if (uiState.widthInPixels !== newGridData.widthInPixels) {
      dispatch(updateUiState(newGridData));
    }
  }, 150);

  useEffect(() => recalcGridDimensions(), []);
  useEffect(() => { setTimeout(recalcGridDimensions, 100) }, []);

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