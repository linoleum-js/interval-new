import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IScheduleData } from '@models/IScheduleData';
import { IScheduleListState } from '@redux/scheduleLists/ScheduleListsStore';
import { fetchScheduleList } from '@redux/scheduleLists/ScheduleListsStore';
import { IAppState } from '@redux/store';
import ScheduleInput from '../ScheduleInput/ScheduleInput';

export interface IScheduleInputCollectionProps {
}

const ScheduleInputCollection = (props: IScheduleInputCollectionProps) => {
  const listState: IScheduleListState = useSelector((state: IAppState) =>
    state.scheduleLists
  );
  const { isLoading, list } = listState;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchScheduleList());
  }, []);

  console.log('listState', listState);

  return <div>
    {list.map((item: IScheduleData) => {
      return <ScheduleInput
        data={item}
      />
    })}
  </div>;
};

export default ScheduleInputCollection;