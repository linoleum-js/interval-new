import React from 'react';

import RangeItem from '../RangeItem/RangeItem';
import { IGridDimensions } from '../RangeGrid/RangeGrid';

import css from './RangeList.module.css';
import { IRangeItemData } from '../../models/IRangeItemData';

export interface IRangeListProps {
  list: Array<IRangeItemData>;
  gridDimensions: IGridDimensions;
}

const RangeList = (props: IRangeListProps) => {
  const { list, gridDimensions } = props;

  return <div className={css.RangeList}>
    {list.map((item) => {
      return <RangeItem
        key={item.id}
        data={item}
        gridDimensions={gridDimensions}
        onChange={(data) => { console.log(data); }}
      />;
    })}
  </div>;
};

export default RangeList;