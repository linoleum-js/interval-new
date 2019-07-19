import { Reducer, Action } from 'redux';

import { IRangeItemData } from '@models/IRangeItemData';
import { IRangeData } from '@models/IRangeData';

const singleItem: IRangeData = {
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

const data: Array<IRangeData> = [singleItem];

export interface IRangeListState {
  isLoading: boolean;
  list: Array<IRangeData>;
}

export enum RangeActionTypes {
  RequestRangeList = 'REQUEST_RANGE_LIST',
  ReceiveRangeList = 'RECEIVE_RANGE_LIST',
  UpdateRangeList = 'FETCH_RANGE_LIST'
}

export interface RangeActionPayload {
  list?: Array<IRangeData>;
  item?: IRangeData;
}

export interface RequestRangeListAction {
  type: RangeActionTypes.RequestRangeList;
  payload: RangeActionPayload;
}

export interface ReceiveRangeListAction {
  type: RangeActionTypes.ReceiveRangeList;
  payload: RangeActionPayload;
}

export interface UpdateRangeAction {
  type: RangeActionTypes.ReceiveRangeList;
  payload: RangeActionPayload;
}

export type RangeAction =
  RequestRangeListAction |
  ReceiveRangeListAction |
  UpdateRangeAction;

export const updateRange = (data: IRangeData) => (dispatch: Function) => {
  dispatch({
    type: RangeActionTypes.UpdateRangeList,
    payload: {
      item: data
    }
  });
};

export const fetchList = () => async (dispatch: Function) => {
  dispatch({
    type: RangeActionTypes.ReceiveRangeList,
    payload: {
      list: data
    }
  });
};

const initialState: IRangeListState = {
  list: [],
  isLoading: false
};

export const rangeListsReducer: Reducer<IRangeListState> = (
  state: IRangeListState = initialState,
  action: Action
): IRangeListState => {
  const { type, payload } = action as RangeAction;

  switch (type) {
    case RangeActionTypes.RequestRangeList:
      return {
        isLoading: true,
        list: []
      };
    case RangeActionTypes.ReceiveRangeList:
      return {
        isLoading: false,
        list: payload.list!
      };
  }

  return state;
};