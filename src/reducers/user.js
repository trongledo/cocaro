const initState = {};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_REQUEST':
      return {
        loading: true
      };
    case 'GET_SUCCESS':
      return {
        loading: false,
        user: action.user
      };
    case 'GET_FAILURE':
      return {
        user: null,
        error: action.error
      };
    default:
      return state;
  }
};

export default userReducer;
