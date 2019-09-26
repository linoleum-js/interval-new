
import React from 'react';
import { msToHHMM } from '@util/util';
import { Direction } from '@models/Direction';

import {
  movableElement, MovableElementProps
} from '@components/utils/MovableElement/MovableElement';

import css from './ScheduleIntervalHandle.module.css';

export interface IScheduleIntervalHandleProps extends MovableElementProps {
  direction: Direction;
  value: number;
}

const ScheduleIntervalHandle = (props: IScheduleIntervalHandleProps) => {
  const { direction, value } = props;

  const getDirectionClassName = (): string => {
    return direction === Direction.Left ?
      css.ScheduleIntervalHandleLeft :
      css.ScheduleIntervalHandleRight;
  };

  return <div
    className={`${css.ScheduleIntervalHandle} ${getDirectionClassName()}`}
  >
    <div
      className={css.ScheduleIntervalHandleBody}
    >
      {msToHHMM(value)}
    </div>
  </div>;
};

export default movableElement(ScheduleIntervalHandle);