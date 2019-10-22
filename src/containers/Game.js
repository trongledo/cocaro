/* eslint-disable import/no-unresolved */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
import { connect } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import * as actions from '../actions';
import Board from '../components/Board';
import calculateWinner from '../components/Function';

const BOARDSIZE = 20;

class Game extends React.Component {
  handleClick(i) {
    const history = this.props.history.slice(0, this.props.step.stepNumber + 1);
    this.props.sliceHistory(history);

    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.props.step.xIsNext ? 'X' : 'O';

    this.props.updateHistory(squares, i);
    this.props.jumpTo(history.length, !this.props.step.xIsNext);
  }

  render() {
    const currentUser = this.props.user.user;

    console.log(currentUser);
    let greeting = 'Welcome';
    let loginButtonID = 'acc-button';
    let logoutButtonID = 'hidden';
    if (currentUser && currentUser.user !== false) {
      const { token } = currentUser;
      console.log(token);
      const { name } = currentUser.user;
      greeting = `Hi ${name}`;
      loginButtonID = 'hidden';
      logoutButtonID = 'acc-button';
    }

    const { history } = this.props;
    const current = history[this.props.step.stepNumber];
    const checkWinner = calculateWinner(current.squares);
    let winnerLocation = [];
    let winner = null;

    const className = this.props.step.stepReversed ? 'col-reverse' : '';

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
            onClick={() => this.props.jumpTo(move, move % 2 === 0)}
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
      status = `Next player: ${this.props.step.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div>
        <div className="user-info">
          <div className="user-name">{greeting}</div>
        </div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
              winnerLocation={winnerLocation}
            />
          </div>
          <div className="game-info">
            <div>
              <Link to="/login">
                <button
                  className="blue-gradient"
                  id={loginButtonID}
                  type="button"
                >
                  LOGIN
                </button>
              </Link>
              <Link to="/register">
                <button
                  className="blue-gradient"
                  id={loginButtonID}
                  type="button"
                >
                  REGISTER
                </button>
              </Link>
              <button
                onClick={() => this.props.logout()}
                id={logoutButtonID}
                className="blue-gradient"
                type="button"
              >
                LOGOUT
              </button>
            </div>
            <div>{status}</div>
            <div>
              <button
                type="button"
                id="sel-button"
                onClick={() => this.props.jumpTo(0, false)}
              >
                Start Over
              </button>
              <button
                type="button"
                id="opt-button"
                onClick={() =>
                  this.props.reverseStep(this.props.step.stepReversed)
                }
              >
                Reverse Order
              </button>
            </div>
            <ol className={className}>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    history: state.history,
    step: state.step,
    user: state.authentication
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateHistory: (squares, index) => {
      dispatch(actions.updateHistory(squares, index));
    },
    sliceHistory: history => {
      dispatch(actions.sliceHistory(history));
    },
    jumpTo: (stepNumber, xIsNext) => {
      dispatch(actions.jumpTo(stepNumber, xIsNext));
    },
    reverseStep: stepReversed => {
      dispatch(actions.reverseStep(stepReversed));
    },
    logout: () => {
      dispatch(actions.logoutUser());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
