/* eslint-disable no-case-declarations */
const stepInit = {
  stepNumber: 0,
  stepReversed: false,
  xIsNext: true,
  versusAI: false,
  versusPlayer: false,
  playerTurn: true,
  matchFound: true,
  winnerStatus: null
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
    case 'VERSUS_PLAYER':
      return {
        ...state,
        versusPlayer: !state.versusPlayer,
        versusAI: false
      };
    case 'CHANGE_TURN':
      return {
        ...state,
        playerTurn: action.playerTurn
      };
    case 'MATCH_FOUND':
      return {
        ...state,
        matchFound: action.matchFound
      };
    case 'CHANGE_WINNER_STATUS':
      return {
        ...state,
        winnerStatus: action.winnerStatus
      };
    default:
      return state;
  }
};

export default stepReducer;
