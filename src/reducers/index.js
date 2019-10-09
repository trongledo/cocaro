import { combineReducers } from 'redux';
import historyReducer from './history';
import stepReducer from './step';

const allReducers = combineReducers({
  history: historyReducer,
  step: stepReducer
});

export default allReducers;
