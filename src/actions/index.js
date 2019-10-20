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

// export const handleClick = i => {
//   return {
//     type: 'HANDLE_CLICK',
//     i
//   };
// };
