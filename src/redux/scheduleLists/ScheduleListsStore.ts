import { Reducer, Action } from 'redux';
import { findIndex } from 'lodash';
// @ts-ignore
import undoable from 'redux-undo';

import { IScheduleData } from '@models/IScheduleData';
import {
  fillScheduleWithEmpty, addEmptyBoundaries, generateIds
} from '@util/scheduleInputUtil';

const schedule: any = {
  id: '123123',
  userName: '123123',
  list: [
    {
    start: 0 * 60 * 1000,
    end: 60 * 60 * 1000,
    type: 1
  },
  {
    start: 250 * 60 * 1000,
    end: 380 * 60 * 1000,
    type: 2
  }
  , {
    start: 720 * 60 * 1000,
    end: 780 * 60 * 1000,
    type: 2
  }
  , {
    start: 1020 * 60 * 1000,
    end: 1080 * 60 * 1000,
    type: 2
  }
]
};


const data: IScheduleData[] = [schedule
  , {...schedule, id: '1'}
  , {...schedule, id: '2'}
  , {...schedule, id: '3'}
  , {...schedule, id: '4'}
  , {...schedule, id: '5'}
  , {...schedule, id: '6'}
  , {...schedule, id: '7'}
  , {...schedule, id: '8'}
  , {...schedule, id: '9'}
  , {...schedule, id: '10'}
  , {...schedule, id: '11'}
];

export interface IScheduleListState {
  isLoading: boolean;
  list: IScheduleData[];
}

export enum ScheduleActionTypes {
  RequestScheduleList = 'REQUEST_SCHEDULE_LIST',
  ReceiveScheduleList = 'RECEIVE_SCHEDULE_LIST',
  UpdateScheduleList = 'UPDATE_SCHEDULE_LIST',
  UndoUpdateScheduleList = 'UNDO_UPDATE_SCHEDULE_LIST',
  RedoUpdateScheduleList = 'REDO_UPDATE_SCHEDULE_LIST',
}

export interface ScheduleActionPayload {
  list: IScheduleData[];
  schedule: IScheduleData;
}

export interface RequestScheduleListAction {
  type: ScheduleActionTypes.RequestScheduleList;
}

export interface ReceiveScheduleListAction {
  type: ScheduleActionTypes.ReceiveScheduleList;
  payload: IScheduleData[];
}

export interface UpdateScheduleAction {
  type: ScheduleActionTypes.UpdateScheduleList;
  payload: IScheduleData;
}

export type ScheduleAction =
  RequestScheduleListAction |
  ReceiveScheduleListAction |
  UpdateScheduleAction;

export const updateSchedule = (data: IScheduleData) => (dispatch: Function) => {
  dispatch({
    type: ScheduleActionTypes.UpdateScheduleList,
    payload: data
  });
};

export const fetchScheduleList = () => async (dispatch: Function) => {
  dispatch({
    type: ScheduleActionTypes.ReceiveScheduleList,
    payload: data.map((item: IScheduleData) => fillScheduleWithEmpty(generateIds(item)))
  });
};

export const undoUpdateSchedule = () => {
  return {
    type: ScheduleActionTypes.UndoUpdateScheduleList
  };
};

export const redoUpdateSchedule = () => {
  return {
    type: ScheduleActionTypes.RedoUpdateScheduleList
  };
};

const initialState: IScheduleListState = {
  list: [],
  isLoading: false
};

const scheduleListsReducerBody: Reducer<IScheduleListState> = (
  state: IScheduleListState = initialState,
  action: Action
): IScheduleListState => {
  const { type } = action as ScheduleAction;

  switch (type) {
    case ScheduleActionTypes.RequestScheduleList:
      return {
        isLoading: true,
        list: []
      };

    case ScheduleActionTypes.ReceiveScheduleList:  
      const { payload: scheduleList } = action as ReceiveScheduleListAction;
      return {
        isLoading: false,
        list: scheduleList
      };

    case ScheduleActionTypes.UpdateScheduleList:
      const { payload: schedule } = action as UpdateScheduleAction;
      const { list } = state;
      const index: number = findIndex(list, { id: schedule.id });
      const prevItems: IScheduleData[] = list.slice(0, index);
      const nextItems: IScheduleData[] = list.slice(index + 1);

      return {
        isLoading: false,
        list: [...prevItems, addEmptyBoundaries(schedule), ...nextItems]
      };
  }

  return state;
};

export const scheduleListsReducer = undoable(scheduleListsReducerBody, {
  undoType: ScheduleActionTypes.UndoUpdateScheduleList,
  redoType: ScheduleActionTypes.RedoUpdateScheduleList,
  initTypes: ['@@redux-undo/INIT', ScheduleActionTypes.ReceiveScheduleList],
  ignoreInitialState: true
})
