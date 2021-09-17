import {useState} from "react";
import {Cell} from "../Cell/Cell";
import {colours} from "../../colours";


let key = 1;
function uniqueKey() {
  return key++;
}

function initializeState(props) {
  let board = Array(props.NUM_ROWS)
    .fill(Array(props.NUM_COLUMNS)
      .fill({
        color: colours.neutral,
        isCleared: false,
        isClearedAdj: false,
        isFlagged: false,
        isMineRevealed: false,
        number:''}));

  board = board.map((row, rowIdx) => row.map((col, colIdx) => {
    return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx}
  }));

  let cleared = []; // tracks cleared squares

  return {
    board,
    cleared,
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
        handleRightClick={props.handleRightClick}
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

function checkForAdjacent(rowIdx, colIdx, adjacent) {
    for (let i = 0; i < adjacent.length; i++) {
      if (adjacent[i][0] === rowIdx && adjacent[i][1] === colIdx && adjacent[i][2] > 0) {
        return adjacent[i][2];
      }
    }
    return 0;
}

export default function Board(props) {
  const [boardState, setBoardState] = useState(initializeState(props));

  function checkFlagCase(affectedRow, rowIdx, colIdx, toggleFlag) {
    // toggle flag on
    // toggle flag off, return to cleared blank
    // toggle flag off, return to cleared adjacent
    // toggle flag off, return to uncovered mine
    // toggle flag off, return to neutral

    let colour = colours.mineUncovered;

    if (toggleFlag === true) {
      console.log("flag!"); //DEBUG
      colour = colours.flag;
    } else if (toggleFlag === false && affectedRow[colIdx].isCleared) {
      console.log("unflagging, returning to cleared blank")
      colour = colours.clearedSafe;
    } else if (toggleFlag === false && affectedRow[colIdx].isMineRevealed) {
      console.log("unflagging, returning to uncovered mine")
      colour = colours.mineUncovered;
    } else if (toggleFlag === false && affectedRow[colIdx].isClearedAdj) {
      console.log("unflagging, returning to clearead adjacent")
      colour = colours.clearedAdj
    } else {
      console.log("unflagging, returning to neutral"); //DEBUG
      colour = colours.neutral;
    }

    affectedRow[colIdx] = {
      ...affectedRow[colIdx],
      color: colour,
      isFlagged: toggleFlag
    };

    return affectedRow.slice();
  }

  function handleRightClick(e, rowIdx, colIdx, flagged) {
    e.preventDefault(); // prevent right click menu from showing when clicking board

    let toggleFlag = !flagged;
    console.log(`toggleFlag is: ${toggleFlag}`);
    let board = boardState.board;
    let newBoard = board.slice();
    let affectedRow = board[rowIdx].slice();

    affectedRow = checkFlagCase(affectedRow.slice(), rowIdx, colIdx, toggleFlag);

    newBoard[rowIdx] = affectedRow;
    setBoardState({
      ...boardState,
      board: newBoard
    });
  }

  // TODO: clearing cells must not clear flagged cells
  function handleClick(rowIdx, colIdx) {
    console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}`); //DEBUG

    let board = boardState.board;
    let newBoard = board.slice();
    let affectedRow = board[rowIdx].slice();
    let death = false;

    // MARK: Cell selection conditional
    if (checkForMines([rowIdx, colIdx], props.FIELD.getMineCords())) {
      console.log("BOOM!"); //DEBUG
      affectedRow[colIdx] = {
        ...affectedRow[colIdx],
        color: colours.mineHit,
        isCleared: true
      };
      newBoard[rowIdx] = affectedRow;
      death = true;
    } else if (checkForAdjacent(rowIdx, colIdx, props.FIELD.getAdjacentInfo()) > 0) {
      console.log("clicked adjacent cell"); //DEBUG
      affectedRow[colIdx] = {
        ...affectedRow[colIdx],
        color: colours.clearedAdj,
        isClearedAdj: true,
        number: checkForAdjacent(rowIdx, colIdx, props.FIELD.getAdjacentInfo())
      };
      newBoard[rowIdx] = affectedRow;
    } else {
      console.log("safe......"); //DEBUG
      sweepFromOrigin(rowIdx, colIdx);
      boardState.cleared.forEach(cell => {
        if (isInBounds(cell[0], cell[1])) {
          let affectedRow = newBoard[cell[0]].slice();
          if(cell[2] === 0) {
            affectedRow[cell[1]] = {
              ...affectedRow[cell[1]],
              isCleared: true,
              color: colours.clearedSafe
            };
          } else {
            affectedRow[cell[1]] = {
              ...affectedRow[cell[1]],
              color: colours.clearedAdj,
              isClearedAdj: true,
              number: cell[2]
            };
          }
          newBoard[cell[0]] = affectedRow;
        } else {
        }
      });
    }

    setBoardState({
      ...boardState,
      board: newBoard,
      gameOver: death
    });
  }

  function isInBounds(rowIdx, colIdx) {
    return rowIdx >= 0 && colIdx >= 0 && rowIdx <= props.NUM_ROWS - 1 && colIdx <= props.NUM_COLUMNS - 1;
  }

  function sweepFromOrigin(rowIdx, colIdx) {
    let initMineCount = checkAdjacentCells(rowIdx, colIdx);
    let backlog = [[rowIdx, colIdx, initMineCount]];

    while(backlog.length > 0) {
      let cord = backlog.at(-1);
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

      while (r <= rEnd && isInBounds(r,c)) {
        while (c <= cEnd && isInBounds(r,c)) {
          if (!checkForMines([r, c], props.FIELD.getMineCords())) {
            let mineCount = checkAdjacentCells(r, c);
            if (JSON.stringify(boardState.cleared).includes(JSON.stringify([r, c, mineCount]))) {
              c++;
              continue;
            }
            if (mineCount === 0) {
              backlog.push([r, c, mineCount]);
              boardState.cleared.push([r, c, mineCount]);
            } else {
              boardState.cleared.push([r, c, mineCount]);
            }
          }
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
      }
    }
  }

  function checkAdjacentCells(rowIdx, colIdx) {
    let mineCount = 0;
    for(let r = rowIdx - 1; r <= rowIdx + 1; r++) {
      for (let c = colIdx - 1; c <= colIdx + 1; c++) {
          if (checkForMines([r,c], props.FIELD.getMineCords())) {
            mineCount++;
          }
        }
    }
    return mineCount;
  }

  function toggleRevealMines() {
    let board = boardState.board;
    let newBoard = board.slice();

    let toggleReveal = !boardState.boardRevealed;
    let colour = colours.neutral;

    if (toggleReveal === true) {
      colour = colours.mineUncovered;
    } else {
      colour = colours.neutral;
    }

    props.FIELD.getMineCords().forEach(mine => {
      let affectedRow = newBoard[mine[0]].slice();
      affectedRow[mine[1]] = {
        ...affectedRow[mine[1]],
        color: colour,
        isMineRevealed: toggleReveal
      };
      newBoard[mine[0]] = affectedRow;
    });

    setBoardState({
      ...boardState,
      board: newBoard,
      boardRevealed: !boardState.boardRevealed
    });
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
                                                              handleRightClick={handleRightClick}
          />))
        }
        </tbody>
      </table>
      <button onClick={toggleRevealMines}>REVEAL MINES</button>
      <button onClick={logState}>DEBUG: Log boardState</button>
    </>
  );
}