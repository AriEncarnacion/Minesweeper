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
    gameOver: false,
    boardRevealed: false
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
    if (mines[itr][0] === selected[0] && mines[itr][1] === selected[1]) {
      foundMine = true;
    }
    itr++;
  }
  return foundMine;
}

export default function Board(props) {
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
    if (affectedRow[colIdx].color === "blue") {
      setBoardState({
        ...boardState,
        board:newBoard,
        gameOver: true
      });
    } else {
      setBoardState({
        ...boardState,
        board: newBoard
      });
    }
    console.log(`handleClick finished with ${JSON.stringify(boardState)}`);
  }

  function toggleRevealMines() {
    let toggleReveal = !boardState.boardRevealed;
    if (toggleReveal === true) {
      revealMines();
    } else {
      hideMines();
    }
  }

  function revealMines() {
    let board = boardState.board;
    let newBoard = board.slice();
    props.FIELD.forEach(mine => {
      let affectedRow = newBoard[mine[0]].slice();
      affectedRow[mine[1]] = {
        ...affectedRow[mine[1]],
        color: "green"
      };
      newBoard[mine[0]] = affectedRow;
    });

    setBoardState({
      ...boardState,
      board: newBoard,
      boardRevealed: !boardState.boardRevealed
    });
  }

  function hideMines() {
    let board = boardState.board;
    let newBoard = board.slice();
    props.FIELD.forEach(mine => {
      let affectedRow = newBoard[mine[0]].slice();
      affectedRow[mine[1]] = {
        ...affectedRow[mine[1]],
        color: "gray"
      };
      newBoard[mine[0]] = affectedRow;
    });

    setBoardState({
      ...boardState,
      board: newBoard,
      boardRevealed: !boardState.boardRevealed
    });
  }

  function logMines() {
    console.log(props.FIELD);
  }

  function logState() {
    console.log(boardState);
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
      <button onClick={toggleRevealMines}>REVEAL MINES</button>
      <button onClick={logMines}>Mine Cords</button>
      <button onClick={logState}>DEBUG: Log boardState</button>
    </>
  );
}