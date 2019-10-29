/* eslint-disable no-case-declarations */
const stepInit = {
  stepNumber: 0,
  stepReversed: false,
  xIsNext: true,
  versusAI: false
};

const stepReducer = (state = stepInit, action) => {
  switch (action.type) {
    case 'JUMP_TO':
      return {
        ...state,
        stepNumber: action.stepNumber,
        xIsNext: action.xIsNext
      };
    case 'REVERSE_STEP':
      return {
        ...state,
        stepReversed: !state.stepReversed
      };
    case 'VERSUS_AI':
      return {
        ...state,
        versusAI: !state.versusAI
      };
    default:
      return state;
  }
};

export default stepReducer;
