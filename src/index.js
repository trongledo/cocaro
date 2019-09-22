import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { kStringMaxLength } from 'buffer';

const BOARDSIZE = 20;

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
      var className ='square';
      for(var index = 0; index < 5; index++)
      {
        if(i === this.props.winnerLocation[index]) {
            className = 'square highlight'
        }
      }
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={className}
      />
    );
  }

  render() {
    const board = [];
    let row;

    for (let i = 0; i < BOARDSIZE; i++) {
      row = [];
      for (let j = 0; j < BOARDSIZE; j++) {
        row.push(i * BOARDSIZE + j);
      }
      board.push(row);
    }

    return (
      <div>
        <div className="board-row">
          <div className="indicator">::</div>
          {
                board.map((row, index) => (
                  <div className="indicator">
                    {String.fromCharCode(65 + index)}
                  </div>
                ))
                }
        </div>

        {
                board.map((row, index) => (
                  <div className="board-row" key={row}>
                    <div className="indicator"><a>{index + 1}</a></div>
                    {row.map((cellId) => <a key={cellId}>{this.renderSquare(cellId)}</a>)}
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
        squares: Array(BOARDSIZE * BOARDSIZE).fill(null),
        location: null,
      }],
      stepNumber: 0,
      stepReversed: false,
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
        squares,
        location: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseOrder() {
    this.setState({
        stepReversed: !this.state.stepReversed
    })
  }

  render() {
    const { history } = this.state;
    const current = history[this.state.stepNumber];
    var checkWinner = calculateWinner(current.squares);
    var winnerLocation = [];
    var winner = null;
    
    const className = this.state.stepReversed
        ? "col-reverse"
        : "";

    const moves = history.map((step, move) => {
      const xCoord = String.fromCharCode((step.location % BOARDSIZE) + 65);
      const yCoord = Math.floor(step.location / BOARDSIZE + 1);
      const desc = move
        ? `Go to move #${move}: ${xCoord}${yCoord}`
        : 'Go to game start';
      return (
        <li key={step}>
          <button className="step" onClick={() => this.jumpTo(move)}>{desc}</button>
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
            onClick={(i) => this.handleClick(i)}
            winnerLocation={winnerLocation}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
              <button id="opt-button" onClick={() => this.reverseOrder()}>Reverse Order</button>
          </div>
          <ol className={className}>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);

function calculateWinner(squares) {
    var results = [{
        value: null,
        locations: Array(5).fill(null),
    }]

    var locations = [];

// CHECK ROWS
  for (let i = 0; i < BOARDSIZE; i++) {
    let blocked = false; // head not blocked
    let count = 1;
    var locations = [];
    for (let j = 0; j < BOARDSIZE - 1; j++) {
      if (squares[j + i * BOARDSIZE] === squares[j + i * BOARDSIZE + 1] && squares[j + i * BOARDSIZE] != null) {
        count++;
        locations.push(j + i * BOARDSIZE);

      } else {
        if (squares[j + i * BOARDSIZE] != null) {
          blocked = true;
        }
        count = 1;
        locations = [];
      }
      if (count === 5) {
        if (j < (BOARDSIZE - 2) && blocked === true && squares[j + i * BOARDSIZE + 1] !== squares[j + i * BOARDSIZE + 2]
                    && squares[j + i * BOARDSIZE + 2] !== null) {
          blocked = false;
          return null;
        }
        locations.push(j + i * BOARDSIZE + 1)
        results.value = squares[j + i * BOARDSIZE];
        results.locations = locations;
        return results;
      }
    }
  }

// CHECK COLS
  for (let i = 0; i < BOARDSIZE; i++) {
    let blocked = false; // head not blocked
    let count = 1;
    locations = [];
    for (let j = 0; j < BOARDSIZE - 1; j++) {
      // Check Cols
      if (squares[i + j * BOARDSIZE] === squares[i + (j + 1) * BOARDSIZE] && squares[i + j * BOARDSIZE] != null) {
        count++;
        locations.push(i + j * BOARDSIZE);

      } else {
        if (squares[i + j * BOARDSIZE] != null) {
          blocked = true;
        }
        count = 1;
        locations = [];
      }
      if (count === 5) {
        if (j < (BOARDSIZE - 2) && blocked === true && squares[i + (j + 1) * BOARDSIZE] !== squares[i + (j + 2) * BOARDSIZE]
                    && squares[j + i * BOARDSIZE + 2] !== null) {
          blocked = false;
          return null;
        }
        locations.push(i + (j + 1) * BOARDSIZE)
        results.value = squares[i + j * BOARDSIZE];
        results.locations = locations;
        return results;
      }
    }
  }

  // CHECK DIA #1
  for (let i = 0; i < BOARDSIZE; i++) {
    let blocked = false; // head not blocked
    let count = 1;
    locations = [];
    for (let j = 0; j < BOARDSIZE - 1; j++) {
      if (squares[i + j * (BOARDSIZE + 1)] === squares[i + (j + 1) * (BOARDSIZE + 1)] && squares[i + j * (BOARDSIZE + 1)] != null) {
        count++;
        locations.push(i + j * (BOARDSIZE + 1));

      } else {
        if (squares[i + j * (BOARDSIZE + 1)] != null) {
          blocked = true;
        }
        count = 1;
        locations = [];
      }
      if (count === 5) {
        if (j < (BOARDSIZE - 2) && blocked === true && squares[i + (j + 1) * (BOARDSIZE + 1)] !== squares[i + (j + 2) * (BOARDSIZE + 1)]
                    && squares[j + i * BOARDSIZE + 2] !== null) {
          blocked = false;
          return null;
        }
        locations.push(i + (j + 1) * (BOARDSIZE + 1))
        results.value = squares[i + j * (BOARDSIZE + 1)];
        results.locations = locations;
        return results;
      }
    }
  }

   // CHECK DIA #2
   for (let i = 0; i < BOARDSIZE; i++) {
    let blocked = false; // head not blocked
    let count = 1;
    locations = [];
    for (let j = 0; j < BOARDSIZE - 1; j++) {
      if (squares[i + j * (BOARDSIZE - 1)] === squares[i + (j + 1) * (BOARDSIZE - 1)] && squares[i + j * (BOARDSIZE - 1)] != null) {
        count++;
        locations.push(i + j * (BOARDSIZE - 1));

      } else {
        if (squares[i + j * (BOARDSIZE - 1)] != null) {
          blocked = true;
        }
        count = 1;
        locations = [];
      }
      if (count === 5) {
        if (j < (BOARDSIZE - 2) && blocked === true && squares[i + (j + 1) * (BOARDSIZE - 1)] !== squares[i + (j + 2) * (BOARDSIZE - 1)]
                    && squares[j + i * BOARDSIZE + 2] !== null) {
          blocked = false;
          return null;
        }
        locations.push(i + (j + 1) * (BOARDSIZE - 1))
        results.value = squares[i + j * (BOARDSIZE - 1)];
        results.locations = locations;
        return results;
      }
    }
  }

  return null;
}