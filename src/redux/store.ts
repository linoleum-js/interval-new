import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { scheduleListsReducer, IScheduleListState } from '@redux/scheduleLists/ScheduleListsStore';
import { uiStateReducer, IUiStateState } from './uiState/uiStateStore';

export interface IAppState {
  scheduleLists: IScheduleListState;
  uiState: IUiStateState;
}

const store = createStore(
  combineReducers<IAppState>({
    scheduleLists: scheduleListsReducer,
    uiState: uiStateReducer
  }),
  compose(
    applyMiddleware(thunk)
  )
);

export default store;