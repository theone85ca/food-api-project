const initialState = {
  firstName: '',
  id: '',
  isLoggedIn: false,
  isLoggingIn: false,
  isPasswordReset: false,
  isPasswordChanged: false,
  lastName: '',
  registrationSucceeded: false,
  username: '',
  userRegistered: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'AUTHENTICATION_LOGIN_ATTEMPT': {
      const newState = Object.assign({}, state);
      newState.isLoggingIn = true;
      return newState;
    }
    case 'AUTHENTICATION_LOGIN_FAILURE':
    case 'AUTHENTICATION_SESSION_CHECK_FAILURE':
    case 'AUTHENTICATION_LOGOUT_SUCCESS': {
      const newState = Object.assign({}, initialState);
      return newState;
    }
    case 'AUTHENTICATION_LOGIN_SUCCESS':
    case 'AUTHENTICATION_SESSION_CHECK_SUCCESS':{
      const newState = Object.assign({}, state);
      newState.firstName = action.json.firstName;
      newState.id = action.json._id;
      newState.isLoggedIn = true;
      newState.isLoggingIn = false;
      newState.lastName = action.json.lastName;
      newState.username = action.json.username;
      return newState;
    }
    case 'AUTHENTICATION_LOGOUT_FAILURE':
    case 'AUTHENTICATION_REGISTRATION_FAILURE' : {
      return state;
    }
    case 'AUTHENTICATION_PASSWORD_RESET_CLEAR' :
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE' : {
      const newState = Object.assign({}, state);
      newState.isPasswordReset = false;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED': {
      const newState = Object.assign({}, state);
      newState.isPasswordReset = true;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_SAVE_CLEAR' : {
      const newState = Object.assign({}, state);
      newState.isPasswordChanged = false;
      return newState;
    }
    case 'AUTHENTICATION_PASSWORD_SAVE_SUCCESS' : {
      const newState = Object.assign({}, state);
      newState.isPasswordChanged = true;
      return newState;
    }
    case 'AUTHENTICATION_REGISTRATION_SUCCESS' : {
      const newState = Object.assign({}, state);
      newState.registrationSucceeded = true;
      newState.userRegistered = true;
      return newState;
    }
    // All we’re doing here is taking the existing authentication state, whatever it is,
    // and switching the registrationSucceeded value to false.
    case 'AUTHENTICATION_REGISTRATION_SUCCESS_VIEWED' : {
      const newState = Object.assign({}, state);
      newState.registrationSucceeded = false;
      return newState;
    }
    default: {
      return state;
    }
  }
}
