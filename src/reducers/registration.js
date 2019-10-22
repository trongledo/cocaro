const registrationReducer = (state = {}, action) => {
  switch (action.type) {
    case 'REGISTER_REQUEST':
      return { registering: true };
    case 'REGISTER_SUCCESS':
      return { registering: false, user: action.user };
    case 'REGISTER_FAILURE':
      return { registering: false };
    default:
      return state;
  }
};

export default registrationReducer;
