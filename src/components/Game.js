/* eslint-disable import/no-unresolved */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
import { connect } from 'react-redux';
import React from 'react';
import * as actions from '../actions';
import Board from './Board';
import calculateWinner from './Function';

const BOARDSIZE = 20;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // history: [
      //   {
      //     squares: Array(BOARDSIZE * BOARDSIZE).fill(null),
      //     location: null
      //   }
      // ],
      stepNumber: 0,
      stepReversed: false,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.props.history.slice(0, this.state.stepNumber + 1);
    // const history = this.state.history.slice(0, this.state.stepNumber + 1);

    this.props.sliceHistory(history);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.props.updateHistory(squares, i);

    this.setState({
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  reverseOrder() {
    this.setState({
      stepReversed: !this.state.stepReversed
    });
  }

  render() {
    const { history } = this.props;
    // const { history } = this.state;
    const current = history[this.state.stepNumber];
    const checkWinner = calculateWinner(current.squares);
    let winnerLocation = [];
    let winner = null;

    const className = this.state.stepReversed ? 'col-reverse' : '';

    const moves = history.map((step, move) => {
      const xCoord = String.fromCharCode((step.location % BOARDSIZE) + 65);
      const yCoord = Math.floor(step.location / BOARDSIZE + 1);
      const desc = move
        ? `Go to move #${move}: ${xCoord}${yCoord}`
        : 'Go to game start';
      return (
        <li key={step}>
          <button
            type="button"
            className="step"
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (checkWinner) {
      winner = checkWinner.value;
      status = `Winner: ${winner}`;
      winnerLocation = checkWinner.locations;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winnerLocation={winnerLocation}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button
              type="button"
              id="sel-button"
              onClick={() => this.jumpTo(0)}
            >
              Start Over
            </button>
            <button
              type="button"
              id="opt-button"
              onClick={() => this.reverseOrder()}
            >
              Reverse Order
            </button>
          </div>
          <ol className={className}>{moves}</ol>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    history: state.history
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateHistory: (squares, index) => {
      dispatch(actions.updateHistory(squares, index));
    },
    sliceHistory: history => {
      dispatch(actions.sliceHistory(history));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
