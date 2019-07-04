import React from 'react';

import IntervalItem, { IIntervalItemData } from '../IntervalItem/IntervalItem';

import css from './IntervalList.module.css';

export interface IIntervalListProps {
  list: Array<IIntervalItemData>
}

const IntervalList = (props: IIntervalListProps) => {
  const { list } = props;

  return <div className={css.IntervalList}>
    {list.map((item) => {
      return <IntervalItem
        key={item.id}
        data={item}
      />;
    })}
  </div>;
};

export default IntervalList;