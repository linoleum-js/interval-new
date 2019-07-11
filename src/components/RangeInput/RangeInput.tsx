import React, { useEffect } from 'react';

import RangeItem from '../RangeItem/RangeItem';

import { IRangeItemData } from '../../models/IRangeItemData';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState } from '../../redux/store';
import { IUiStateState } from '../../redux/uiState/uiStateStore';
import { IRangeData } from '../../models/IRangeData';

import css from './RangeInput.module.css';

export interface IRangeInputProps {
  data: IRangeData;
}

const RangeInput = (props: IRangeInputProps) => {
  const uiState: IUiStateState = useSelector((state: IAppState) =>
    state.uiState
  );
  const { data } = props;
  const { list } = data;

  const dispatch = useDispatch();

  // const { list, gridDimensions } = props;

  return <div className={css.RangeList}>
    {list.map((item: IRangeItemData) => {
      return <RangeItem
        key={item.id}
        data={item}
        onChange={(data) => { console.log(data); }}
      />;
    })}
  </div>;
};

export default RangeInput;