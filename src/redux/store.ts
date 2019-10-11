import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {
  scheduleListsReducer, IScheduleListState, ScheduleActionTypes
} from '@redux/scheduleLists/ScheduleListsStore';
import { uiStateReducer, IUiState } from './uiState/uiStateStore';

export interface IAppState {
  scheduleLists: {
    past: IScheduleListState[];
    present: IScheduleListState;
    future: IScheduleListState[];
  };
  uiState: IUiState;
}

const store = createStore(
  combineReducers<IAppState>({
    scheduleLists: scheduleListsReducer,
    uiState: uiStateReducer
  }),
  compose(
    applyMiddleware(thunk, logger)
  )
);

export default store;