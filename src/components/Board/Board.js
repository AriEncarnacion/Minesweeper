import {useState} from "react";
import {Cell} from "../Cell/Cell";
import GenerateField from "./Field"; // rows, cols, mines

let key = 1;
function uniqueKey() {
  return key++;
}

function initializeState(props) {
  let mineCords = GenerateField(props.NUM_ROWS, props.NUM_COLUMNS, props.NUM_MINES);

  let board = Array(props.NUM_ROWS).fill(Array(props.NUM_COLUMNS).fill({color: "gray", isCleared: false}));
  board = board.map((row, rowIdx) => row.map((col, colIdx) => {
    return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx}
  }));

  return {
    board,
    gameWin: false,
    gameOver: false
  }
}

const Row = (props) => {
  return (
    <tr className={"BoardRow"}>
      {props.row.map((cell, idx) => <Cell key={uniqueKey()}
        cell={cell}
        rowIdx={props.rowIdx}
        colIdx={idx}
        handleClick={props.handleClick}
        />)}
    </tr>
  );
}

export default function Board(props) {
  const [boardState, setBoardState] = useState(initializeState(props));

  function handleClick(rowIdx, colIdx) {
    console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}, ${JSON.stringify(boardState)}`);

    let board = boardState.board;

    let affectedRow = board[rowIdx].slice();
    affectedRow[colIdx] = {
      ...affectedRow[colIdx],
      color: "red",
      isCleared: true
    };

    let newBoard = board.slice();
    newBoard[rowIdx] = affectedRow;
    setBoardState({
      ...boardState,
      board: newBoard
    });
  }

  return (
    <>
      <table className={"GameBoard"}>
        <tbody>
        {
          boardState.board.map((row, rowIdx) => (<Row key={uniqueKey()}
                                                              row={row}
                                                              rowIdx={rowIdx}
                                                              handleClick={handleClick}
          />))
        }
        </tbody>
      </table>
    </>
  );
}