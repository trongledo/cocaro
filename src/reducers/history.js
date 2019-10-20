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
    // case 'HANDLE_CLICK':
    //   history = state.history.slice(0, this.props.step.stepNumber + 1);

    //   this.props.sliceHistory(history);

    //   const current = history[history.length - 1];
    //   const squares = current.squares.slice();

    //   if (calculateWinner(squares) || squares[action.i]) {
    //     return [];
    //   }

    //   squares[action.i] = this.props.step.xIsNext ? 'X' : 'O';

    //   return [
    //     ...state,
    //     {
    //       squares: this.squares,
    //       location: action.i
    //     }
    //   ];
    default:
      return state;
  }
};

export default historyReducer;
