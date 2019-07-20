import { Reducer, Action } from 'redux';

import { IScheduleIntervalData } from '@models/IScheduleIntervalData';

export interface IUiState {
  widthInPixels: number;
  stepSizeInPixels: number;
}

export enum UiStateActionTypes {
  UpdateUiState = 'UPDATE_UI_STATE'
}

export interface UpdateUiStateAction {
  type: UiStateActionTypes.UpdateUiState;
  payload: IUiState;
}

export const updateUiState = (payload: IUiState) => (dispatch: Function) => {
  dispatch({
    type: UiStateActionTypes.UpdateUiState,
    payload
  });
}

const initialState: IUiState = {
  widthInPixels: 1,
  stepSizeInPixels: 1
};

export const uiStateReducer: Reducer<IUiState> = (
  state: IUiState = initialState,
  action: Action
): IUiState => {
  const { type, payload } = action as UpdateUiStateAction;

  switch (type) {
    case UiStateActionTypes.UpdateUiState:
      return payload;
  }

  return state;
};