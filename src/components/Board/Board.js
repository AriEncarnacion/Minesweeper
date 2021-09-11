import {useState} from "react";
import {Cell} from "../Cell/Cell";

let key = 1;
function uniqueKey() {
  return key++;
}

function initializeState(props) {
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
  console.log(props.FIELD["mines"]);

  function handleClick(rowIdx, colIdx) {
    // console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}, ${JSON.stringify(boardState)}`);
    console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}`);

    let board = boardState.board;

    let affectedRow = board[rowIdx].slice();
    let selectedCords = [rowIdx, colIdx];

    let mines = props.FIELD["mines"]
    let foundMine = false;
    let itr = 0;
    while(foundMine === false && itr < mines.length) {
      if (mines[itr].x === selectedCords[0] && mines[itr].y === selectedCords[1]) {
        foundMine = true;
      }
        itr++;
    }

    // MARK: Cell selection conditional
    if (foundMine) {
      console.log("BOOM!");
      affectedRow[colIdx] = {
        ...affectedRow[colIdx],
        color: "blue",
        isCleared: true
      };
    } else {
      console.log("safe......");
      affectedRow[colIdx] = {
        ...affectedRow[colIdx],
        color: "red",
        isCleared: true
      };
    }

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