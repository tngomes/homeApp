import { clickReducer } from './clickReducer';
import { keyBoardReducer } from './keyBoardReducer';
import { combineReducers } from 'redux';
export const Reducers = combineReducers({
  clickState: clickReducer,
  keyBoardState: keyBoardReducer
});