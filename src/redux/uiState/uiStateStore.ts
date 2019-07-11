
import { IRangeItemData } from '../../models/IRangeItemData';
import { Reducer, Action } from 'redux';

export interface IUiStateState {
  widthInPixels: number;
  stepSizeInPixels: number;
}

export enum UiStateActionTypes {
  UpdateUiState = 'UPDATE_UI_STATE'
}

export interface UpdateUiStateAction {
  type: UiStateActionTypes.UpdateUiState;
  payload: IUiStateState;
}

export const updateUiState = (payload: IUiStateState) => (dispatch: Function) => {
  dispatch({
    type: UiStateActionTypes.UpdateUiState,
    payload
  });
}

const initialState: IUiStateState = {
  widthInPixels: 0,
  stepSizeInPixels: 0
};

export const uiStateReducer: Reducer<IUiStateState> = (
  state: IUiStateState = initialState,
  action: Action
): IUiStateState => {
  const { type, payload } = action as UpdateUiStateAction;

  switch (type) {
    case UiStateActionTypes.UpdateUiState:
      return payload;
  }

  return state;
};