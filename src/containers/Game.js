/* eslint-disable class-methods-use-this */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
import { connect } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import gomokuAI from 'gomokuai';
import socketIOClient from 'socket.io-client';
import LoadingOverlay from 'react-loading-overlay';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import * as actions from '../actions';
import Board from '../components/Board';
import calculateWinner from '../helpers/Function';
import Chatbox from '../components/Chatbox';

const BOARDSIZE = 20;
let socket = null;

class Game extends React.Component {
  componentDidMount() {
    // this.props.getUser();
  }

  submitUndoRequest = () => {
    confirmAlert({
      title: 'Your opponent requests to undo',
      message: 'Accept request?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            if (this.props.step.playerTurn) {
              this.props.jumpTo(
                this.props.history.length - 2,
                !this.props.step.xIsNext
              );
              const { history } = this.props;
              const current = history[history.length - 2];
              const squares = current.squares.slice();
              const i = current.location;
              socket.emit('sendHistory', {
                squares,
                i,
                xIsNext: this.props.step.xIsNext
              });
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  submitSurrenderRequest = () => {
    confirmAlert({
      title: 'Your opponent surrenders',
      message: 'Accept request?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            console.log(this.props.user.user.user.name);
            socket.emit('sendWinnerInfo', this.props.user.user.user.name);
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  handleClick(i) {
    if (this.props.step.playerTurn) {
      const history = this.props.history.slice(
        0,
        this.props.step.stepNumber + 1
      );
      this.props.sliceHistory(history);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.props.step.xIsNext ? 'X' : 'O';

      this.props.updateHistory(squares, i);
      this.props.jumpTo(history.length, !this.props.step.xIsNext);

      // Versus AI
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

      // Vesus Player
      if (this.props.step.versusPlayer) {
        socket.emit('sendHistory', {
          squares,
          i,
          xIsNext: this.props.step.xIsNext
        });
      }
    }
  }

  handleToggleAI() {
    this.props.toggleVersusAI(this.props.step.versusAI);
    this.props.jumpTo(0, true);
  }

  handleTogglePlayer() {
    this.props.toggleVersusPlayer(this.props.step.versusPlayer);
    this.props.changePlayerTurn(true);
    this.props.changeMatchFound(true);
    document.getElementById('user2').innerHTML = 'Player 2';
    document.getElementById('player2Image').src =
      'https://click4m.madhyamam.com/Appresources/images/man.svg';

    if (!this.props.step.versusPlayer) {
      this.props.changeMatchFound(false);
      this.props.changePlayerTurn(false);
      // socket = socketIOClient('https://cocaro-api.herokuapp.com');
      socket = socketIOClient('https://cocaro-api.herokuapp.com');
      const currentUser = this.props.user.user;

      socket.emit(
        'join',
        {
          name: currentUser.user.name,
          email: currentUser.user.email,
          image: currentUser.user.image
        },
        error => {
          if (error) {
            console.log(error);
          }
        }
      );

      socket.on('history', ({ squares, i, xIsNext }) => {
        const history = this.props.history.slice(
          0,
          this.props.step.stepNumber + 1
        );
        this.props.sliceHistory(history);

        this.props.updateHistory(squares, i);
        this.props.jumpTo(history.length, !xIsNext);
        this.props.changePlayerTurn(!this.props.step.playerTurn);
      });

      socket.on('playerTurn', playerTurn => {
        this.props.changePlayerTurn(playerTurn);
      });
      socket.on('winnerInfo', winnerInfo => {
        this.props.changeWinnerStatus(winnerInfo);
      });
      socket.on('undoRequest', undoRequest => {
        if (undoRequest && this.props.step.playerTurn) {
          this.submitUndoRequest();
        }
      });
      socket.on('surrenderRequest', surrenderRequest => {
        if (this.props.step.playerTurn !== surrenderRequest) {
          this.submitSurrenderRequest();
        }
      });
    } else if (socket) {
      socket.disconnect();
    }

    // Xoa quan co tren ban co
    this.props.jumpTo(0, true);
    const ncb = document.getElementById('customSwitches');
    ncb.checked = null;
  }

  handlePlayerUndo() {
    if (!this.props.step.playerTurn && this.props.step.stepNumber !== 0) {
      socket.emit('passUndoRequest', true);
    }
  }

  handlePlayerSurrender() {
    socket.emit('passSurrenderRequest', this.props.step.playerTurn);
  }

  logOut() {
    this.props.logout();
    // this.props.getUser();
  }

  render() {
    // const currentUser = this.props.userInfo.user;
    const currentUser = this.props.user.user;

    let greeting = 'Welcome!';
    let defaultImage = 'https://image.flaticon.com/icons/svg/206/206865.svg';
    let loginButtonID = 'acc-button';
    let logoutButtonID = 'hidden';
    let renderChatbox;
    let matchClassName = 'hidden';
    let AIButtonID = '';
    let findMatchBtnText = 'Find Match';
    if (this.props.step.versusPlayer) {
      AIButtonID = 'hidden';
      findMatchBtnText = 'Leave';
      matchClassName = '';

      socket.on('roomData', ({ users }) => {
        if (this.props.step.playerTurn) {
          document.getElementById('user1').innerHTML = `${users[0].name}: (X)`;
          if (users[1]) {
            document.getElementById(
              'user2'
            ).innerHTML = `${users[1].name}: (O)`;
            document.getElementById('player2Image').src = users[1].image;
            this.props.changeMatchFound(true);
          }
        } else {
          document.getElementById('user2').innerHTML = `${users[0].name}: (X)`;
          if (users[1]) {
            document.getElementById(
              'user1'
            ).innerHTML = `${users[1].name}: (O)`;
            document.getElementById('player2Image').src = users[0].image;
            this.props.changeMatchFound(true);
          }
        }
      });

      renderChatbox = (
        <Chatbox currentUser={currentUser.user} socket={socket} />
      );
    }
    if (currentUser) {
      const { name } = currentUser.user;
      greeting = `Hi ${name}!`;
      if (currentUser.user.image) {
        defaultImage = currentUser.user.image;
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
    if (this.props.step.winnerStatus) {
      status = `Winner: ${this.props.step.winnerStatus}`;
    }

    return (
      <div>
        <div className="game">
          <div className="user-info">
            <div className="user-name">{greeting}</div>
            <div className="user-photo">
              <img src={defaultImage} alt="Profile" />
            </div>

            <div className="d-flex justify-content-center mt-2">
              <button
                id={logoutButtonID}
                className="mdb-color"
                onClick={() => this.handleTogglePlayer()}
                type="button"
              >
                {findMatchBtnText}
              </button>
            </div>
            <div id={matchClassName}>
              <LoadingOverlay
                active={!this.props.step.matchFound}
                spinner
                styles={{
                  overlay: base => ({
                    ...base,
                    background: 'rgba(255, 255, 255, 0)',
                    color: 'black'
                  }),
                  spinner: base => ({
                    ...base,
                    width: '100px',
                    '& svg circle': {
                      stroke: 'rgba(255, 0, 0, 0.5)'
                    }
                  })
                }}
              >
                <div
                  id="user1"
                  className="mt-2 font-weight-bold h6 d-flex justify-content-center"
                >
                  Player 1
                </div>
                <div className="versus-photo d-flex justify-content-center">
                  <img
                    alt="Versus"
                    src="https://image.flaticon.com/icons/svg/1732/1732452.svg"
                  />
                </div>
                <div
                  id="user2"
                  className="mt-2 mb-4 font-weight-bold h6 d-flex justify-content-center"
                >
                  Player 2
                </div>
                <div className="d-flex justify-content-center player2-photo">
                  <img
                    src="https://click4m.madhyamam.com/Appresources/images/man.svg"
                    alt="Player 2"
                    id="player2Image"
                  />
                </div>
              </LoadingOverlay>
            </div>
          </div>
          <LoadingOverlay
            active={!this.props.step.matchFound}
            spinner
            text="Finding opponent..."
            styles={{
              overlay: base => ({
                ...base,
                background: 'rgba(255, 255, 255, 0)',
                color: 'black'
              }),
              spinner: base => ({
                ...base,
                width: '100px',
                '& svg circle': {
                  stroke: 'rgba(255, 0, 0, 0.5)'
                }
              })
            }}
          >
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
                winnerLocation={winnerLocation}
              />
            </div>
          </LoadingOverlay>
          <div className="game-info">
            <div id={AIButtonID}>
              <Link to="/login">
                <button className="mdb-color" id={loginButtonID} type="button">
                  LOGIN
                </button>
              </Link>
              <Link to="/register">
                <button className="mdb-color" id={loginButtonID} type="button">
                  REGISTER
                </button>
              </Link>
              <Link to="/account">
                <button id={logoutButtonID} className="mdb-color" type="button">
                  ACCOUNT
                </button>
              </Link>
              <button
                onClick={() => this.logOut()}
                id={logoutButtonID}
                className="mdb-color"
                type="button"
              >
                LOGOUT
              </button>
            </div>
            <div>{status}</div>
            <div id={AIButtonID}>
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
            <div id={matchClassName}>
              <LoadingOverlay
                active={!this.props.step.matchFound}
                spinner
                styles={{
                  overlay: base => ({
                    ...base,
                    background: 'rgba(255, 255, 255, 0)',
                    color: 'black'
                  }),
                  spinner: base => ({
                    ...base,
                    width: '100px',
                    '& svg circle': {
                      stroke: 'rgba(255, 0, 0, 0.5)'
                    }
                  })
                }}
              >
                <button
                  onClick={() => this.handlePlayerUndo()}
                  id="sel-button"
                  type="button"
                >
                  Undo
                </button>
                <button
                  onClick={() => this.handlePlayerSurrender()}
                  id="opt-button"
                  type="button"
                >
                  Surrender
                </button>
                <div className="chat-box">{renderChatbox}</div>
              </LoadingOverlay>
            </div>
            <div id={AIButtonID} className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customSwitches"
                onClick={() => this.handleToggleAI()}
              />
              <label className="custom-control-label" htmlFor="customSwitches">
                Versus AI
              </label>
            </div>
            <div id={AIButtonID}>
              <ol className={className}>{moves}</ol>
            </div>
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
    },
    toggleVersusPlayer: versusPlayer => {
      dispatch(actions.toggleVersusPlayer(versusPlayer));
    },
    changePlayerTurn: playerTurn => {
      dispatch(actions.changePlayerTurn(playerTurn));
    },
    changeMatchFound: matchFound => {
      dispatch(actions.changeMatchFound(matchFound));
    },
    changeWinnerStatus: winnerStatus => {
      dispatch(actions.changeWinnerStatus(winnerStatus));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
