import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { rangeListsReducer, IRangeListState } from './rangeLists/RangeListsStore';
import { uiStateReducer, IUiStateState } from './uiState/uiStateStore';

export interface IAppState {
  rangeLists: IRangeListState;
  uiState: IUiStateState;
}

const store = createStore(
  combineReducers<IAppState>({
    rangeLists: rangeListsReducer,
    uiState: uiStateReducer
  }),
  compose(
    applyMiddleware(thunk)
  )
);

export default store;