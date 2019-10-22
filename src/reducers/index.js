import { combineReducers } from 'redux';
import historyReducer from './history';
import stepReducer from './step';
import authenticationReducer from './authentication';
import registrationReducer from './registration';

const allReducers = combineReducers({
  history: historyReducer,
  step: stepReducer,
  authentication: authenticationReducer,
  registration: registrationReducer
});

export default allReducers;
