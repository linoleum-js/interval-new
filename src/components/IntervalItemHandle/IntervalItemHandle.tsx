import React from 'react';

import css from './IntervalItemHandle.module.css';

export enum Direction {
  Left,
  Right
}

export interface IIntervalItemHandleProps {
  direction: Direction;
}

const IntervalItemHandle = (props: IIntervalItemHandleProps) => {
  const { direction } = props;
  const getDirectionClassName = (): string => {
    return direction === Direction.Left ?
      css.IntervalItemHandleLeft :
      css.IntervalItemHandleRight;
  };

  return <div
    className={`${css.IntervalItemHandle} ${getDirectionClassName()}`}
  >
    <div
      className={css.IntervalItemHandleBody}
    ></div>
  </div>
};

export default IntervalItemHandle;