import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IScheduleData } from '@models/IScheduleData';
import { IScheduleListState } from '@redux/scheduleLists/ScheduleListsStore';
import {
  fetchScheduleList, undoUpdateSchedule, redoUpdateSchedule
} from '@redux/scheduleLists/ScheduleListsStore';
import { IAppState } from '@redux/store';
import ScheduleInput from '../ScheduleInput/ScheduleInput';

export interface IScheduleInputCollectionProps {
}

const ScheduleInputCollection = (props: IScheduleInputCollectionProps) => {
  const listStateHistory = useSelector((state: IAppState) => state.scheduleLists);
  const listState: IScheduleListState = listStateHistory.present;
  const { isLoading, list } = listState;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchScheduleList());
  }, []);

  const undoRedoHandler = (event: KeyboardEvent) => {
    const { keyCode, ctrlKey, shiftKey } = event;
    if (keyCode === 90) {
      if (ctrlKey) {
        if (shiftKey) {
          dispatch(redoUpdateSchedule());
        } else {
          dispatch(undoUpdateSchedule());
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', undoRedoHandler, false);
    return () => {
      document.removeEventListener('keydown', undoRedoHandler, false);
    };
  });

  return <div>
    {list.map((item: IScheduleData) => {
      return <ScheduleInput
        key={item.id}
        data={item}
        id={item.id}
      />
    })}
  </div>;
};

export default ScheduleInputCollection;