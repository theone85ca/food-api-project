import { combineReducers } from 'redux';
import AuthenticationReducer from '../reducers/authentication';
import ErrorReducer from '../reducers/error';
import ProgressReducer from '../reducers/progress';

const reducers = {
  authentication: AuthenticationReducer,
  progress: ProgressReducer,
  error: ErrorReducer,
};

export default combineReducers(reducers);
