/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/destructuring-assignment */
import React from 'react';

const BOARDSIZE = 20;

function Square(props) {
  return (
    <button type="button" className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let className = 'square';
    for (let index = 0; index < 5; index++) {
      if (i === this.props.winnerLocation[index]) {
        className = 'square highlight';
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
          {board.map((_row, index) => (
            <div className="indicator">{String.fromCharCode(65 + index)}</div>
          ))}
        </div>

        {board.map((rows, index) => (
          <div className="board-row" key={rows}>
            <div className="indicator">
              <a>{index + 1}</a>
            </div>
            {rows.map(cellId => (
              <a key={cellId}>{this.renderSquare(cellId)}</a>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Board;
