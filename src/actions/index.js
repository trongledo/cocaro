/* eslint-disable import/prefer-default-export */

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

export const updateStep = (stepNumber, xIsNext) => {
  return {
    type: 'UPDATE_STEP',
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
