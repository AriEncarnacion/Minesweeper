import {useState} from "react";
import {Cell} from "../Cell/Cell";
// import Stack from "../../Stack.js";

let key = 1;
function uniqueKey() {
  return key++;
}

function initializeState(props) {
  let board = Array(props.NUM_ROWS).fill(Array(props.NUM_COLUMNS).fill({color: "gray", isCleared: false, number:''}));

  board = board.map((row, rowIdx) => row.map((col, colIdx) => {
    return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx}
  }));

  let cleared = []; // tracks cleared squares

  return {
    board,
    cleared,
    gameWin: false,
    gameOver: false,
    boardRevealed: false,
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
    console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}`); //DEBUG

    let board = boardState.board;
    let newBoard = board.slice();
    let affectedRow = board[rowIdx].slice();
    let death = false;
    // MARK: Cell selection conditional
    if (checkForMines([rowIdx, colIdx], props.FIELD[0])) {
      console.log("BOOM!"); //DEBUG
      affectedRow[colIdx] = {
        ...affectedRow[colIdx],
        color: "blue",
        isCleared: true
      };
      newBoard[rowIdx] = affectedRow;
      death = true;
    } else {
      console.log("safe......"); //DEBUG
      boardState.cleared.forEach(cell => {
        if (isInBounds(cell[0], cell[1])) {
          let affectedRow = newBoard[cell[0]].slice();
          if(cell[2] === 0) {
            affectedRow[cell[1]] = {
              ...affectedRow[cell[1]],
              color: "red"
            };
          } else {
            affectedRow[cell[1]] = {
              ...affectedRow[cell[1]],
              color: "yellow"
            };
          }
          newBoard[cell[0]] = affectedRow;
        } else {
          console.log(`cell ${cell} out of bounds, skipping`); //DEBUG
        }

      });
    }

    setBoardState({
      ...boardState,
      board: newBoard,
      gameOver: death
    });
    // console.log(`handleClick finished with ${JSON.stringify(boardState)}`);
  }

  function isInBounds(rowIdx, colIdx) {
    // console.log(`[${rowIdx}, ${colIdx}] IS BOUND ${rowIdx >= 0 && colIdx >= 0 && rowIdx <= props.NUM_ROWS - 1 && colIdx <= props.NUM_COLUMNS - 1}`);
    return rowIdx >= 0 && colIdx >= 0 && rowIdx <= props.NUM_ROWS - 1 && colIdx <= props.NUM_COLUMNS - 1;
  }

  // function checkAdjacentCells(rowIdx, colIdx) {
  //   let mineCount = 0;
  //   for(let r = rowIdx - 1; r <= rowIdx + 1; r++) {
  //     for (let c = colIdx - 1; c <= colIdx + 1; c++) {
  //         if (checkForMines([r,c], props.FIELD[0])) {
  //           mineCount++;
  //         }
  //       }
  //   }
  //   return mineCount;
  // }

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
    props.FIELD.getMineCords().forEach(mine => {
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
    props.FIELD.getMineCords().forEach(mine => {
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
    console.log(props.FIELD.getMineCords());
  }

  function logState() {
    console.log(boardState);
  }

  function logAdjacents() {
    console.log(props.FIELD.getAdjacentInfo());
  }

  function showAdjacent() {
    let board = boardState.board;
    let newBoard = board.slice();
    props.FIELD.getAdjacentInfo().forEach(cell => {
      let affectedRow = newBoard[cell[0]].slice();
      affectedRow[cell[1]] = {
        ...affectedRow[cell[1]],
        color: "yellow",
        number: cell[2]
      };
      newBoard[cell[0]] = affectedRow;
    });

    console.log(newBoard);
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
      <button onClick={toggleRevealMines}>REVEAL MINES</button>
      <button onClick={logMines}>Mine Cords</button>
      <button onClick={logState}>DEBUG: Log boardState</button>
      <button onClick={logAdjacents}>DEBUG: Log adjacentCords</button>
      <button onClick={showAdjacent}>DEBUG: visualize adjacentCords</button>
    </>
  );
}