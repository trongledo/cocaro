/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */

import fetch from 'cross-fetch';
import browserHistory from '../helpers/history';

export const updateHistory = (squares, index) => {
  return {
    type: 'UPDATE',
    squares,
    index
  };
};

export const sliceHistory = history => {
  return {
    type: 'SLICE',
    history
  };
};

export const jumpTo = (stepNumber, xIsNext) => {
  return {
    type: 'JUMP_TO',
    stepNumber,
    xIsNext
  };
};

export const reverseStep = stepReversed => {
  return {
    type: 'REVERSE_STEP',
    stepReversed
  };
};

function request(user) {
  return { type: 'LOGIN_REQUEST', user };
}
function success(user) {
  return { type: 'LOGIN_SUCCESS', user };
}
function failure(error) {
  return { type: 'LOGIN_FAILURE', error };
}

function requestRegister(user) {
  return { type: 'REGISTER_REQUEST', user };
}
function successRegister(user) {
  return { type: 'REGISTER_SUCCESS', user };
}
function failureRegister(error) {
  return { type: 'REGISTER_FAILURE', error };
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logoutUser();
      }

      // const error = (data && data.message) || response.statusText;
      // return Promise.reject(error);
      return data;
    }
    return data;
  });
}

const login = async (email, password) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  };
  try {
    const response = await fetch(
      `https://cocaro-api.herokuapp.com/user/login`,
      requestOptions
    );

    const userData = await handleResponse(response);

    if (userData.user) {
      localStorage.setItem('user', JSON.stringify(userData));
    }

    return userData;
  } catch (err) {
    return err;
  }

  // return fetch(`https://cocaro-api.herokuapp.com/user/login`, requestOptions)
  //   .then(handleResponse)
  //   .then(user => {
  //     // store user details and jwt token in local storage to keep user logged in between page refreshes
  //     console.log('Thanh cong');
  //     console.log(user);
  //     localStorage.setItem('user', JSON.stringify(user));

  //     return user;
  //   });
};

const register = async user => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };
  try {
    const response = await fetch(
      `https://cocaro-api.herokuapp.com/user/register`,
      requestOptions
    );

    const userData = await handleResponse(response);

    return userData;
  } catch (err) {
    return err;
  }
};

export const loginUser = (email, password) => {
  return async dispatch => {
    dispatch(request({ email }));
    try {
      const user = await login(email, password);

      if (user) {
        dispatch(success(user));
        if (user.user) {
          browserHistory.push('/');
        }
      }
    } catch (err) {
      dispatch(failure(err.toString()));
    }
  };
};

export const registerUser = user => {
  return async dispatch => {
    dispatch(requestRegister(user));

    try {
      const newUser = await register(user);

      console.log('newUser');
      console.log(newUser);
      if (newUser.newUser) {
        dispatch(successRegister());

        browserHistory.push('/login');
      } else {
        dispatch(successRegister(newUser));
      }
    } catch (err) {
      dispatch(failureRegister(err.toString()));
    }
  };
};

export const logoutUser = () => {
  localStorage.removeItem('user');
  return { type: 'LOGOUT' };
};
