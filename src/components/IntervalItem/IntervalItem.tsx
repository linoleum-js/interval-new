
import React from 'react';

import css from './IntervalItem.module.css';

export interface IIntervalItemData {
  start: number;
  end: number;
  type: number;
  id: string;
}

export interface IIntervalItemProps {
  data: IIntervalItemData;
}

const IntervalItem = (props: IIntervalItemProps) => {
  const { data } = props;
  // const { start, end, type } = data;
  
  return <div className={css.IntervalItem}>

  </div>;
};

export default IntervalItem;