
import React from 'react';

import {
  movableElement, MovableElementProps
} from '@components/utils/MovableElement/MovableElement';

import css from './ScheduleIntervalBody.module.css';

export interface IScheduleIntervalBodyProps extends MovableElementProps {
}

const ScheduleIntervalBody = (props: IScheduleIntervalBodyProps) => {
  return <div className={`${css.ScheduleIntervalBody}`}></div>;
};

export default movableElement<IScheduleIntervalBodyProps>(ScheduleIntervalBody);