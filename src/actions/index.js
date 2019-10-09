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
