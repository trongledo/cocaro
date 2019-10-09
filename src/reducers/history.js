/* eslint-disable no-case-declarations */

const BOARDSIZE = 20;

const history = [
  {
    squares: Array(BOARDSIZE * BOARDSIZE).fill(null),
    location: null
  }
];

const historyReducer = (state = history, action) => {
  switch (action.type) {
    case 'SLICE':
      return [...action.history];
    case 'UPDATE':
      return [
        ...state,
        {
          squares: action.squares,
          location: action.index
        }
      ];
    default:
      return state;
  }
};

export default historyReducer;
