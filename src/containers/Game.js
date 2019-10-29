/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
import { connect } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import gomokuAI from 'gomokuai';
import * as actions from '../actions';
import Board from '../components/Board';
import calculateWinner from '../components/Function';

const BOARDSIZE = 20;

class Game extends React.Component {
  componentDidMount() {
    // this.props.getUser();
  }

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

    if (this.props.step.versusAI) {
      const newBoard = squares.map(value => {
        if (value === 'X') {
          return 1;
        }
        if (value === 'O') {
          return 2;
        }
        return 0;
      });

      const { x, y } = gomokuAI.bestMove(newBoard, BOARDSIZE);

      if (calculateWinner(squares) || squares[x + y * BOARDSIZE]) {
        return;
      }

      // squares[x * y] = this.props.step.xIsNext ? 'X' : 'O';
      squares[x + y * BOARDSIZE] = this.props.step.xIsNext ? 'O' : 'X';
      this.props.updateHistory(squares, x * y);
      this.props.jumpTo(history.length + 1, this.props.step.xIsNext);
    }
  }

  handleToggle() {
    this.props.toggleVersusAI(this.props.step.versusAI);
    this.props.jumpTo(0, true);
  }

  logOut() {
    this.props.logout();
    // this.props.getUser();
  }

  render() {
    // const currentUser = this.props.userInfo.user;
    const currentUser = this.props.user.user;

    let greeting = 'Welcome!';
    let defaultImage =
      'https://click4m.madhyamam.com/Appresources/images/man.svg';
    let loginButtonID = 'acc-button';
    let logoutButtonID = 'hidden';
    if (currentUser) {
      const { name } = currentUser.user;
      greeting = `Hi ${name}!`;
      if (currentUser.user.picture) {
        defaultImage = currentUser.user.picture;
      }
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
            onClick={() =>
              this.props.jumpTo(
                move,
                move % 2 === 0 || this.props.step.versusAI
              )
            }
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
        <div className="game">
          <div className="user-info">
            <div className="user-name">{greeting}</div>
            <div className="user-photo">
              <img src={defaultImage} alt="Profile" />
            </div>
          </div>
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
                  className="aqua-gradient"
                  id={loginButtonID}
                  type="button"
                >
                  LOGIN
                </button>
              </Link>
              <Link to="/register">
                <button
                  className="aqua-gradient"
                  id={loginButtonID}
                  type="button"
                >
                  REGISTER
                </button>
              </Link>
              <button
                onClick={() => this.logOut()}
                id={logoutButtonID}
                className="aqua-gradient"
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
                onClick={() => this.props.jumpTo(0, true)}
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
            <div id="" className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customSwitches"
                onClick={() => this.handleToggle()}
              />
              <label className="custom-control-label" htmlFor="customSwitches">
                Versus AI
              </label>
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
    user: state.authentication,
    userInfo: state.userInfo
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
    },
    getUser: () => {
      dispatch(actions.getUser());
    },
    toggleVersusAI: versusAI => {
      dispatch(actions.toggleVersusAI(versusAI));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
