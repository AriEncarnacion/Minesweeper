import {useState} from "react";
import {Cell} from "../Cell/Cell";
// import Stack from "../../Stack.js";

let key = 1;
function uniqueKey() {
  return key++;
}

function initializeState(props) {
  let board = Array(props.NUM_ROWS).fill(Array(props.NUM_COLUMNS).fill({color: "gray", isCleared: false}));

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
    // console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}, ${JSON.stringify(boardState)}`);
    console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}`); //DEBUG

    let board = boardState.board;
    let newBoard = board.slice();
    let affectedRow = board[rowIdx].slice();
    let death = false;
    // MARK: Cell selection conditional
    if (checkForMines([rowIdx, colIdx], props.FIELD)) {
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
      // console.log(`Sending cords: ${rowIdx}, ${colIdx}`);
      // recursiveSweepUp(rowIdx, colIdx);
      // recursiveSweepDown(rowIdx, colIdx);
      sweepFromOrigin_second(rowIdx, colIdx);
      // console.log(`clear cells:`);
      // boardState.cleared.forEach(cell => {console.log(cell)}); //DEBUG
      boardState.cleared.forEach(cell => {
        // console.log(`trying to process cell: ${cell}`);
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
        // console.log(newBoard);

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

  function sweepFromOrigin_second(rowIdx, colIdx) {
    let initMineCount = checkAdjacentCells(rowIdx, colIdx);
    let backlog = [[rowIdx, colIdx, initMineCount]];

    while(backlog.length > 0) {
      let cord = backlog.at(-1);
      console.log("START NEW CONTROL LOOP");
      backlog.pop();

      let r = cord.slice()[0] - 1;
      let c = cord.slice()[1] - 1;
      let rEnd = cord.slice()[0] + 1;
      let cEnd = cord.slice()[1] + 1;

      if (r < 0) {
        r = 0;
      }

      if (c < 0) {
        c = 0;
      }

      console.log(`new origin: ${r}, ${c}`);

      // console.log(r);
      // console.log(rEnd);
      // console.log(c);
      // console.log(cEnd);

      while (r <= rEnd && isInBounds(r,c)) {
        console.log(`processing cell outer: ${r}, ${c}`);

        //FIXME: currently selecting immediately next to a diag pair forces 3x3 sweep.
        // only happens on initial case, so handle for initial case.
        while (c <= cEnd && isInBounds(r,c)) {
          console.log(`processing cell inner: ${r}, ${c}`);
          if (!checkForMines([r, c], props.FIELD)) {
            let mineCount = checkAdjacentCells(r, c);
            if (JSON.stringify(boardState.cleared).includes(JSON.stringify([r, c, mineCount]))) {
              console.log(`cell [${r}, ${c}] already exists`);
              c++;
              continue;
            }
            if (mineCount === 0) {
              console.log(`pushing [${r}, ${c}] with 0 mines`);
              backlog.push([r, c, mineCount]);
              boardState.cleared.push([r, c, mineCount]);
            } else {
              console.log(`pushing [${r}, ${c}] with ${mineCount} mines`);
              // backlog.push([r,c,mineCount]);
              boardState.cleared.push([r, c, mineCount]);
            }
            // backlog.forEach(e=>console.log(e));
          }
          // else {
          //   boardState.cleared.push([r, c, -1]);
          // }

          // else {
          //   backlog.forEach(e=>console.log(e));
          //   break;
          // }
          c++;
        }
        r++;
        c = cord.slice()[1] - 1;
        if (r < 0) {
          r = 0;
        }

        if (c < 0) {
          c = 0;
        }
        // console.log(`about to finish outer with [${r}, ${c}]`);
        // console.log(`cordinate in bounds: ${isInBounds(r, c)}`);
        // backlog.forEach(e=>console.log(e));
      }
    }

  }

  function checkAdjacentCells(rowIdx, colIdx) {
    let mineCount = 0;
    for(let r = rowIdx - 1; r <= rowIdx + 1; r++) {
      for (let c = colIdx - 1; c <= colIdx + 1; c++) {
          if (checkForMines([r,c], props.FIELD)) {
            mineCount++;
          }
        }
    }
    return mineCount;
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