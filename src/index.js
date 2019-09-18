import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
        let board = [];
        let row;

        for (let i = 0; i < 20; i++) {
            row = [];
            for (let j = 0; j < 20; j++) {
                row.push(i*20 + j);
            }
            board.push(row);
        }

      return (
        <div>
            {
                board.map((row, index) => (
                    <div className="board-row" key={index}>
                        {row.map(cellId => <a key={cellId}>{this.renderSquare(cellId)}</a>)}
                    </div>
                ))
            }
          {/* <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div> */}
        </div>
      );
    }
  }
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(400).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
              }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board
             squares={current.squares}
             onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    return checkRow(squares) || checkCol(squares) || checkDia(squares) || checkDia2(squares);
}

function checkRow(squares) {
    for (var i = 0; i < 20; i++) {
        var blocked = false; // head not blocked
        var count = 1;
        for (var j = 0; j < 19; j++) {
            if (squares[j + i*20] === squares[j + i*20 + 1] && squares[j + i*20] != null) {
                count++;
            }
            else {
                if (squares[j + i*20] != null) {
                    blocked = true;
                }
                count = 1;
            } 
            if (count === 5) {
                if (j < 18 && blocked === true && squares[j + i*20 + 1] !== squares[j + i*20 + 2] 
                    && squares[j + i*20 + 2] !== null) {
                        blocked = false;
                    return null;
                }
                return squares[j + i*20];
            }
        }
    }

    return null;
}

function checkCol(squares) {
    for (var i = 0; i < 20; i++) {
        var blocked = false; // head not blocked
        var count = 1;
        for (var j = 0; j < 19; j++) {
            if (squares[i + j*20] === squares[i + (j + 1)*20] && squares[i + j*20] !== null) {
                count++;
            }
            else {
                if (squares[i + j*20] !== null) {
                    blocked = true;
                }
                count = 1;
            }
            if (count === 5) {
                if (j < 18 && blocked === true && squares[i+ (j + 1)*20] !== squares[i + (j + 2)*20]
                    && squares[i + (j + 2)*20] !== null) {
                        blocked = false;
                    return null;
                }

                return squares[i + j*20];
            }
        }
    }

    return null;
}

function checkDia(squares) {
    for (var i = 0; i < 20; i++) {
        var blocked = false; // head not blocked
        var count = 1;
        for (var j = 0; j < 19; j++) {
            if (squares[i + j*21] === squares[i + (j + 1)*21] && squares[i + j*21] !== null) {
                count++;
            }
            else {
                if (squares[i + j*21] !== null) {
                    blocked = true;
                }
                count = 1;
            }
            if (count === 5) {
                if (j < 18 && blocked === true && squares[i+ (j + 1)*21] !== squares[i + (j + 2)*21]
                    && squares[i + (j + 2)*21] !== null) {
                        blocked = false;
                    return null;
                }

                return squares[i + j*21];
            }
        }
    }

    return null;
}

function checkDia2(squares) {
    for (var i = 0; i < 20; i++) {
        var blocked = false; // head not blocked
        var count = 1;
        for (var j = 0; j < 19; j++) {
            if (squares[i + j*19] === squares[i + (j + 1)*19] && squares[i + j*19] !== null) {
                count++;
            }
            else {
                if (squares[i + j*19] !== null) {
                    blocked = true;
                }
                count = 1;
            }
            if (count === 5) {
                if (j < 18 && blocked === true && squares[i+ (j + 1)*19] !== squares[i + (j + 2)*19]
                    && squares[i + (j + 2)*19] !== null) {
                    blocked = false;
                    return null;
                }

                return squares[i + j*19];
            }
        }
    }

    return null;
}