/* eslint-disable react/destructuring-assignment */
import React from 'react';

function Square(props) {
  return (
    <button type="button" className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Square;
