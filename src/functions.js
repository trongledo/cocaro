const BOARDSIZE = 20;

function calculateWinner(squares) {
  const results = [
    {
      value: null,
      locations: Array(5).fill(null)
    }
  ];

  let locations = [];

  // CHECK ROWS
  for (let i = 0; i < BOARDSIZE; i++) {
    let blocked = false; // head not blocked
    let count = 1;
    locations = [];
    for (let j = 0; j < BOARDSIZE - 1; j++) {
      if (
        squares[j + i * BOARDSIZE] === squares[j + i * BOARDSIZE + 1] &&
        squares[j + i * BOARDSIZE] != null
      ) {
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
        if (
          j < BOARDSIZE - 2 &&
          blocked === true &&
          squares[j + i * BOARDSIZE + 1] !== squares[j + i * BOARDSIZE + 2] &&
          squares[j + i * BOARDSIZE + 2] !== null
        ) {
          blocked = false;
          return null;
        }
        locations.push(j + i * BOARDSIZE + 1);
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
      if (
        squares[i + j * BOARDSIZE] === squares[i + (j + 1) * BOARDSIZE] &&
        squares[i + j * BOARDSIZE] != null
      ) {
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
        if (
          j < BOARDSIZE - 2 &&
          blocked === true &&
          squares[i + (j + 1) * BOARDSIZE] !==
            squares[i + (j + 2) * BOARDSIZE] &&
          squares[j + i * BOARDSIZE + 2] !== null
        ) {
          blocked = false;
          return null;
        }
        locations.push(i + (j + 1) * BOARDSIZE);
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
      if (
        squares[i + j * (BOARDSIZE + 1)] ===
          squares[i + (j + 1) * (BOARDSIZE + 1)] &&
        squares[i + j * (BOARDSIZE + 1)] != null
      ) {
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
        if (
          j < BOARDSIZE - 2 &&
          blocked === true &&
          squares[i + (j + 1) * (BOARDSIZE + 1)] !==
            squares[i + (j + 2) * (BOARDSIZE + 1)] &&
          squares[j + i * BOARDSIZE + 2] !== null
        ) {
          blocked = false;
          return null;
        }
        locations.push(i + (j + 1) * (BOARDSIZE + 1));
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
      if (
        squares[i + j * (BOARDSIZE - 1)] ===
          squares[i + (j + 1) * (BOARDSIZE - 1)] &&
        squares[i + j * (BOARDSIZE - 1)] != null
      ) {
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
        if (
          j < BOARDSIZE - 2 &&
          blocked === true &&
          squares[i + (j + 1) * (BOARDSIZE - 1)] !==
            squares[i + (j + 2) * (BOARDSIZE - 1)] &&
          squares[j + i * BOARDSIZE + 2] !== null
        ) {
          blocked = false;
          return null;
        }
        locations.push(i + (j + 1) * (BOARDSIZE - 1));
        results.value = squares[i + j * (BOARDSIZE - 1)];
        results.locations = locations;
        return results;
      }
    }
  }

  return null;
}

export default calculateWinner;
