import { decrementProgress, incrementProgress } from './progress';
import 'whatwg-fetch';

//Action Creators
export const loginAttempt = () => ({ type: 'AUTHENTICATION_LOGIN_ATTEMPT' });
export const loginFailure = error => ({ type: 'AUTHENTICATION_LOGIN_FAILURE', error });
export const loginSuccess = json => ({ type: 'AUTHENTICATION_LOGIN_SUCCESS', json });
export const logoutFailure = error => ({ type: 'AUTHENTICATION_LOGOUT_FAILURE', error});
export const logoutSuccess = () => ({ type: 'AUTHENTICATION_LOGOUT_SUCCESS' });
export const registrationFailure = () => ({ type: 'AUTHENTICATION_REGISTRATION_FAILURE' });
export const registrationSuccess = () => ({ type: 'AUTHENTICATION_REGISTRATION_SUCCESS' });
export const registrationSuccessViewed = () => ({ type: 'AUTHENTICATION_REGISTRATION_SUCCESS_VIEWED' });
export const sessionCheckFailure = () => ({ type: 'AUTHENTICATION_SESSION_CHECK_FAILURE' });
export const sessionCheckSuccess = json => ({ type: 'AUTHENTICATION_SESSION_CHECK_SUCCESS', json });


// Check User Session
export function checkSession() {
  return async (dispatch) => {

  // contact API
  await fetch(
    // where to contact
    '/api/authentication/checksession',

    // what to send
    {
    method: 'GET',
    credentials: 'same-origin',
  },
)
.then((response) => {
  if (response.status === 200) {
    return response.json();
  }
  return null;
})
.then((json) => {
  if (json.username) {
    return dispatch(sessionCheckSuccess(json));
  }
    return dispatch(sessionCheckFailure());

})
.catch(error => dispatch(sessionCheckFailure(error)));
};
}






// Login User
export function logUserIn(userData) {
  return async (dispatch) => {

  // turn on spinner
  dispatch(incrementProgress());

  // register that a login attempt is being made
  dispatch(loginAttempt());

  // contact login API
  await fetch(
    // where to contact
    '/api/authentication/login',

    // what to send
    {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  }
)

.then((response) => {
  if (response.status === 200) {
    return response.json();
  }
  return null;
})

.then((json) => {
  if (json) {
    dispatch(loginSuccess(json));
  } else  {
    dispatch(loginFailure(new Error('Email or Password Incorrect. Please try again.')));
  }
})

.catch((error) => {
  dispatch(loginFailure(new Error(error)));
});

// turn off spinner
return dispatch(decrementProgress());
  };
}






// Log User Out
export function logUserOut() {
  return async (dispatch) => {

  // turn on spinner
  dispatch(incrementProgress());

  // contact the api
  await fetch(

    // where to contact
    '/api/authentication/logout',

    // what to send
    {
    method: 'GET',
    credentials: 'same-origin',
  },
)
  .then((response) => {
    if (response.status === 200) {
      dispatch(logoutSuccess());
    }
    else dispatch(logoutFailure(new Error(response.status)));
  })
  .catch((error) => {
    dispatch(logoutFailure(new Error(error)));
  });

  // turn off spinner
  return dispatch(decrementProgress());
  };
}








// Register a user
export function registerUser(userData) {
  return async (dispatch) => {
    // Turn on the spinner
    dispatch(incrementProgress());

    // Contact the API
    await fetch(
      // Where to Contact
      '/api/authentication/register',
      // What to send
      {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then(async (json) => {
      if (json) {
        await dispatch(loginSuccess(json));
        await dispatch(registrationSuccess());
      } else {
        dispatch(registrationFailure(new Error('Registration Failed. Please try again.')));
      }
    })
    .catch((error) => {
      dispatch(registrationFailure(new Error(error)));
    });

    // Turn off spinner
    return dispatch(decrementProgress());
  };
}
