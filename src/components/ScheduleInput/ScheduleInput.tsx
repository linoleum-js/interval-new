import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ScheduleInterval from '../ScheduleInterval/ScheduleInterval';
import { IScheduleIntervalData } from '@models/IScheduleIntervalData';
import { IAppState } from '@redux/store';
import { IUiState } from '@redux/uiState/uiStateStore';
import { IScheduleData } from '@models/IScheduleData';

import css from './ScheduleInput.module.css';

export interface IScheduleInputProps {
  data: IScheduleData;
}

const ScheduleInput = (props: IScheduleInputProps) => {
  const uiState: IUiState = useSelector((state: IAppState) =>
    state.uiState
  );
  const { data } = props;
  const { list } = data;

  // const { list, gridDimensions } = props;

  return <div className={css.ScheduleList}>
    {list.map((item: IScheduleIntervalData) => {
      return <ScheduleInterval
        key={item.id}
        data={item}
        onChange={(data) => { console.log(data); }}
      />;
    })}
  </div>;
};

export default ScheduleInput;