import { combineReducers } from 'redux';
import historyReducer from './history';
import stepReducer from './step';
import authenticationReducer from './authentication';
import registrationReducer from './registration';
import userReducer from './user';

const allReducers = combineReducers({
  history: historyReducer,
  step: stepReducer,
  authentication: authenticationReducer,
  registration: registrationReducer,
  userInfo: userReducer
});

export default allReducers;
