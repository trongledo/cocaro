import { combineReducers } from 'redux';
import historyReducer from './history';

const allReducers = combineReducers({
  history: historyReducer
});

export default allReducers;
