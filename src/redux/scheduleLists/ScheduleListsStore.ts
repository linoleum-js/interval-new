import { Reducer, Action } from 'redux';
import { findIndex } from 'lodash';

import { IScheduleIntervalData } from '@models/IScheduleIntervalData';
import { IScheduleData } from '@models/IScheduleData';

const schedule: IScheduleData = {
  id: '123123',
  list: [{
    start: 0 * 60 * 1000,
    end: 60 * 60 * 1000,
    type: 1,
    id: '1'
  }, {
    start: 250 * 60 * 1000,
    end: 380 * 60 * 1000,
    type: 2,
    id: '2'
  }]
};

const data: Array<IScheduleData> = [schedule];

export interface IScheduleListState {
  isLoading: boolean;
  list: Array<IScheduleData>;
}

export enum ScheduleActionTypes {
  RequestScheduleList = 'REQUEST_SCHEDULE_LIST',
  ReceiveScheduleList = 'RECEIVE_SCHEDULE_LIST',
  UpdateScheduleList = 'UPDATE_SCHEDULE_LIST'
}

export interface ScheduleActionPayload {
  list?: Array<IScheduleData>;
  schedule?: IScheduleData;
}

export interface RequestScheduleListAction {
  type: ScheduleActionTypes.RequestScheduleList;
  payload: ScheduleActionPayload;
}

export interface ReceiveScheduleListAction {
  type: ScheduleActionTypes.ReceiveScheduleList;
  payload: ScheduleActionPayload;
}

export interface UpdateScheduleAction {
  type: ScheduleActionTypes.UpdateScheduleList;
  payload: ScheduleActionPayload;
}

export type ScheduleAction =
  RequestScheduleListAction |
  ReceiveScheduleListAction |
  UpdateScheduleAction;

export const updateSchedule = (data: IScheduleData) => (dispatch: Function) => {
  dispatch({
    type: ScheduleActionTypes.UpdateScheduleList,
    payload: {
      schedule: data
    }
  });
};

export const fetchScheduleList = () => async (dispatch: Function) => {
  dispatch({
    type: ScheduleActionTypes.ReceiveScheduleList,
    payload: {
      list: data
    }
  });
};

const initialState: IScheduleListState = {
  list: [],
  isLoading: false
};

export const scheduleListsReducer: Reducer<IScheduleListState> = (
  state: IScheduleListState = initialState,
  action: Action
): IScheduleListState => {
  const { type, payload } = action as ScheduleAction;

  switch (type) {
    case ScheduleActionTypes.RequestScheduleList:
      return {
        isLoading: true,
        list: []
      };
    case ScheduleActionTypes.ReceiveScheduleList:
      return {
        isLoading: false,
        list: payload.list!
      };
    case ScheduleActionTypes.UpdateScheduleList:
      const { list } = state;
      const schedule: IScheduleData = payload.schedule!;
      const index: number = findIndex(list, { id: schedule.id });
      const nextItems: Array<IScheduleData> = list.slice(0, index);
      const prevItems: Array<IScheduleData> = list.slice(index + 1);

      return {
        isLoading: false,
        list: [...prevItems, schedule, ...nextItems]
      };
  }

  return state;
};
