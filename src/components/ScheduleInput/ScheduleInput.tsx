import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ScheduleItem from '../ScheduleItem/ScheduleItem';
import { IScheduleItemData } from '@models/IScheduleItemData';
import { IAppState } from '@redux/store';
import { IUiStateState } from '@redux/uiState/uiStateStore';
import { IScheduleData } from '@models/IScheduleData';

import css from './ScheduleInput.module.css';

export interface IScheduleInputProps {
  data: IScheduleData;
}

const ScheduleInput = (props: IScheduleInputProps) => {
  const uiState: IUiStateState = useSelector((state: IAppState) =>
    state.uiState
  );
  const { data } = props;
  const { list } = data;

  // const { list, gridDimensions } = props;

  return <div className={css.ScheduleList}>
    {list.map((item: IScheduleItemData) => {
      return <ScheduleItem
        key={item.id}
        data={item}
        onChange={(data) => { console.log(data); }}
      />;
    })}
  </div>;
};

export default ScheduleInput;