/* eslint-disable no-case-declarations */
const stepInit = {
  stepNumber: 0,
  stepReversed: false,
  xIsNext: true
};

const stepReducer = (state = stepInit, action) => {
  switch (action.type) {
    case 'UPDATE_STEP':
      return {
        ...state,
        stepNumber: action.stepNumber,
        xIsNext: !state.xIsNext
      };
    case 'REVERSE_STEP':
      return {
        ...state,
        stepReversed: !state.stepReversed
      };
    default:
      return state;
  }
};

export default stepReducer;
