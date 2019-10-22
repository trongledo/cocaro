const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggingIn: false, loggedIn: true, user } : {};

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        loggingIn: true,
        user: action.user
      };
    case 'LOGIN_SUCCESS':
      return {
        loggedIn: true,
        loggingIn: false,
        user: action.user
      };
    case 'LOGIN_FAILURE':
      return {};
    case 'LOGOUT':
      return {
        loggingIn: false
      };
    default:
      return state;
  }
};

export default authenticationReducer;
