import React from 'react';

import IntervalItem, { IIntervalItemData } from '../IntervalItem/IntervalItem';
import { IGridDimensions } from '../IntervalGrid/IntervalGrid';

import css from './IntervalList.module.css';

export interface IIntervalListProps {
  list: Array<IIntervalItemData>;
  gridDimensions: IGridDimensions;
}

const IntervalList = (props: IIntervalListProps) => {
  const { list, gridDimensions } = props;

  return <div className={css.IntervalList}>
    {list.map((item) => {
      return <IntervalItem
        key={item.id}
        data={item}
        gridDimensions={gridDimensions}
      />;
    })}
  </div>;
};

export default IntervalList;