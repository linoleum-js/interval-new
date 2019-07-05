import React from 'react';

import css from './IntervalItemHandle.module.css';

export enum Direction {
  Left,
  Right
}

export interface IIntervalItemHandleProps {
  direction: Direction;
  value: number;
}

const IntervalItemHandle = (props: IIntervalItemHandleProps) => {
  const { direction, value } = props;
  const getDirectionClassName = (): string => {
    return direction === Direction.Left ?
      css.IntervalItemHandleLeft :
      css.IntervalItemHandleRight;
  };

  const pad2 = (value: string) => {
    return value.length === 2 ? value : `0${value}`;
  };

  const formatTime = (timeMs: number): string => {
    const msInMinute = 60 * 1000;
    const totalMinutes = timeMs / msInMinute;
    const hours = String(Math.floor(totalMinutes / 60));
    const minutes = String(Math.floor(totalMinutes % 60));
    return `${pad2(hours)}:${pad2(minutes)}`;
  };

  return <div
    className={`${css.IntervalItemHandle} ${getDirectionClassName()}`}
  >
    <div
      className={css.IntervalItemHandleBody}
    >
      {formatTime(value)}
    </div>
  </div>
};

export default IntervalItemHandle;