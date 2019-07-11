
import React, { StyleHTMLAttributes, CSSProperties } from 'react';

import css from './RangeItem.module.css';
import { IGridDimensions } from '../RangeGrid/RangeGrid';
import RangeItemHandle from '../RangeItemHandle/RangeItemHandle';
import { Direction } from '../../models/Direction';
import { MovementData } from '../../models/MovementData';
import { IRangeItemData } from '../../models/IRangeItemData';
import { ActivityType } from '../../models/IActivityType';
import { IUiStateState } from '../../redux/uiState/uiStateStore';
import { useSelector } from 'react-redux';
import { IAppState } from '../../redux/store';
import { stepSizeInMs, msInDay } from '../../constants';


export interface IRangeItemProps {
  data: IRangeItemData;
  onChange: (data: IRangeItemData) => void;
}

export const activityColor = {
  [ActivityType.Empty]: 'transparent',
  [ActivityType.Work]: 'rgb(72, 189, 84)',
  [ActivityType.Lunch]: 'rgb(255, 189, 72)',
  [ActivityType.Break]: 'rgb(255, 189, 72)',
};

const RangeItem = (props: IRangeItemProps) => {
  const uiState: IUiStateState = useSelector((state: IAppState) =>
    state.uiState
  );
  const { data } = props;
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
    const { onChange } = props;
    const { distanceInSteps, direction } = movementData;
    const distanceInMs = distanceInSteps * stepSizeInMs;
    let newStart;
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

    onChange({
      ...data,
      start: newStart
    });
  };

  const onResizeRight = (movementData: MovementData) => {
    const { onChange } = props;
    const { distanceInSteps, direction } = movementData;
    const distanceInMs = distanceInSteps * stepSizeInMs;
    let newEnd;
    if (direction === Direction.Right) {
      newEnd = end + distanceInMs;
      if (newEnd > msInDay) {
        newEnd = newEnd;
      }
    } else {
      newEnd = end - distanceInMs;
      if (newEnd < start + stepSizeInMs) { 
        newEnd = start + stepSizeInMs;
      }
    }

    onChange({
      ...data,
      end: newEnd
    });
  };

  return <div
    className={css.RangeItem}
    style={style}
  >
    <RangeItemHandle
      direction={Direction.Left}
      value={start}
      onResize={onResizeLeft}
    />
    <RangeItemHandle
      direction={Direction.Right}
      value={end}
      onResize={onResizeRight}
    />
  </div>;
};

export default RangeItem;