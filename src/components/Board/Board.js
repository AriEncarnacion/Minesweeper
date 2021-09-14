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

function checkForMines(selected, mines) {
  let foundMine = false;
  let itr = 0;
  while(foundMine === false && itr < mines.length) {
    if (mines[itr].col === selected[0] && mines[itr].row === selected[1]) {
      foundMine = true;
    }
    itr++;
  }
  return foundMine;
}

export default function Board(props) {
  //DEBUG
  // console.log(props.FIELD);
  // console.log(`Revealed bool: ${props.REVEALED}`);
  //DEBUG END

  const [boardState, setBoardState] = useState(initializeState(props));

  function handleClick(rowIdx, colIdx) {
    // console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}, ${JSON.stringify(boardState)}`);
    // console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}`); //DEBUG

    let board = boardState.board;
    let affectedRow = board[rowIdx].slice();

    // MARK: Cell selection conditional
    if (checkForMines([rowIdx, colIdx], props.FIELD)) {
      console.log("BOOM!"); //DEBUG
      affectedRow[colIdx] = {
        ...affectedRow[colIdx],
        color: "blue",
        isCleared: true
      };
    } else {
      console.log("safe......"); //DEBUG
      affectedRow[colIdx] = {
        ...affectedRow[colIdx],
        color: "red",
        isCleared: true
      };
    }

    let newBoard = board.slice(); // MARK: making a reference?
    newBoard[rowIdx] = affectedRow;
    setBoardState({
      ...boardState,
      board: newBoard
    });
  }

  function revealOneMine(rowIdx, colIdx) {
    // console.log(`revealOneMine called with rowIdx = ${rowIdx}, colIdx = ${colIdx}`); //DEBUG
    let board = boardState.board;

    let affectedRow = board[rowIdx].slice();
    affectedRow[colIdx] = {
      ...affectedRow[colIdx],
      color: "green",
      isCleared: true
    };
    console.log("AffectedRow:");
    console.log(affectedRow);

    let newBoard = board.slice();
    newBoard[rowIdx] = affectedRow;
    console.log("NewBoard:");
    console.log(newBoard);

    setBoardState({
      ...boardState,
      board: newBoard
    });

    console.log("Board after setBoardState:");
    console.log(boardState.board);
  }

  function revealMines() {
    props.FIELD.forEach(mine => {
      revealOneMine(mine[0], mine[1]);
      console.log("boardState:");
      console.log(boardState.board);
    });
  }

  function logMines() {
    console.log(props.FIELD);
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
      <button onClick={revealMines}>REVEAL MINES</button>
      <button onClick={logMines}>Mine Cords</button>
    </>
  );
}