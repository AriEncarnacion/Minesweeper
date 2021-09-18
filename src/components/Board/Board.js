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
    boardRevealed: false,
    statusMessage: ''
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

function checkIfAdjacent(rowIdx, colIdx, adjacent) {
    for (let i = 0; i < adjacent.length; i++) {
      if (adjacent[i][0] === rowIdx && adjacent[i][1] === colIdx && adjacent[i][2] > 0) {
        return adjacent[i][2];
      }
    }
    return 0;
}

function checkFlagCase(affectedRow, rowIdx, colIdx, toggleFlag) {
  let colour;

  if (toggleFlag === true) {
    colour = colours.flag;
  } else if (toggleFlag === false && affectedRow[colIdx].isCleared) {
    colour = colours.clearedSafe;
  } else if (toggleFlag === false && affectedRow[colIdx].isMineRevealed) {
    colour = colours.mineUncovered;
  } else if (toggleFlag === false && affectedRow[colIdx].isClearedAdj) {
    colour = colours.clearedAdj
  } else {
    colour = colours.neutral;
  }

  affectedRow[colIdx] = {
    ...affectedRow[colIdx],
    color: colour,
    isFlagged: toggleFlag
  };

  return affectedRow.slice();
}

export default function Board(props) {
  const [boardState, setBoardState] = useState(initializeState(props));

  function handleRightClick(e, rowIdx, colIdx, flagged) {
    e.preventDefault(); // prevent right click menu from showing when clicking board

    if (!boardState.gameOver) {

      let toggleFlag = !flagged;
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
  }

  function handleClick(rowIdx, colIdx) {
    console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}`);

    let board = boardState.board;
    let newBoard = board.slice();

    if (!boardState.gameOver && !boardState.gameWin) {

      let affectedRow = board[rowIdx].slice();

      // MARK: Cell selection conditional
      if (affectedRow[colIdx].isFlagged) {
        console.log(`[${rowIdx}, ${colIdx}] flagged, ignoring clear.`);

      } else if (checkForMines([rowIdx, colIdx], props.FIELD.getMineCords())) {
        console.log("BOOM!");

        props.FIELD.getMineCords().forEach(mine => {
          let affectedRow = newBoard[mine[0]].slice();
          affectedRow[mine[1]] = {
            ...affectedRow[mine[1]],
            color: colours.mineHit
          };
          newBoard[mine[0]] = affectedRow;
        });

        setBoardState({
          ...boardState,
          board: newBoard,
          gameOver: true,
          statusMessage: "You lose :("
        });

      } else if (checkIfAdjacent(rowIdx, colIdx, props.FIELD.getAdjacentInfo()) > 0) {
        console.log("clicked adjacent cell");

        if (boardState.cleared.length === 0) {
          boardState.cleared.push([rowIdx, colIdx, checkIfAdjacent(rowIdx, colIdx, props.FIELD.getAdjacentInfo())]);
        }

        if (JSON.stringify(boardState.cleared).includes(JSON.stringify([rowIdx, colIdx, countAdjacentMines(rowIdx, colIdx)]))) {
          console.log(`[${rowIdx}, ${colIdx}] was cleared before`)
        } else {
          boardState.cleared.push([rowIdx, colIdx, checkIfAdjacent(rowIdx, colIdx, props.FIELD.getAdjacentInfo())]);
        }

        affectedRow[colIdx] = {
          ...affectedRow[colIdx],
          color: colours.clearedAdj,
          isClearedAdj: true,
          number: checkIfAdjacent(rowIdx, colIdx, props.FIELD.getAdjacentInfo())
        };

        newBoard[rowIdx] = affectedRow;
        setBoardState({
          ...boardState,
          board: newBoard
        });
      } else {

        console.log("safe..."); //DEBUG
        sweepFromOrigin(rowIdx, colIdx);
        boardState.cleared.forEach(cell => {
          let affectedRow = newBoard[cell[0]].slice();
          if (cell[2] === 0 && affectedRow[cell[1]].isFlagged === false) {
            affectedRow[cell[1]] = {
              ...affectedRow[cell[1]],
              isCleared: true,
              color: colours.clearedSafe
            };
          } else if (cell[2] > 0 && affectedRow[cell[1]].isFlagged === false) {
            affectedRow[cell[1]] = {
              ...affectedRow[cell[1]],
              color: colours.clearedAdj,
              isClearedAdj: true,
              number: cell[2]
            };
          } else {
            affectedRow[cell[1]] = {
              ...affectedRow[cell[1]]
            }
          }
          newBoard[cell[0]] = affectedRow;
        });
        setBoardState({
          ...boardState,
          board: newBoard
        });
      }
    }

    console.log(`Squares to clear: ${(props.NUM_ROWS * props.NUM_COLUMNS) - boardState.cleared.length}`);
    if(((props.NUM_ROWS * props.NUM_COLUMNS) - boardState.cleared.length) === props.NUM_MINES) {
      setBoardState({
        ...boardState,
        board: newBoard,
        gameWin: true,
        statusMessage: "You win!"
      });
    }
  }

  function resetGame() {
    let board = boardState.board;
    let newBoard = board.slice();

    for(let r = 0; r < props.NUM_ROWS; r++) {
      for(let c = 0; c < props.NUM_COLUMNS; c++) {
        let affectedRow = newBoard[r].slice();
        affectedRow[c] = {
          ...affectedRow[c],
          color: colours.neutral,
          isCleared: false,
          isClearedAdj: false,
          isFlagged: false,
          isMineRevealed: false,
          number: ''
        }
        newBoard[r] = affectedRow;
      }
    }

    setBoardState({
      ...boardState,
      board: newBoard,
      cleared: [],
      gameWin: false,
      gameOver: false,
      boardRevealed: false,
      statusMessage: ''
    });
  }

  function isInBounds(rowIdx, colIdx) {
    return rowIdx >= 0 && colIdx >= 0 && rowIdx <= props.NUM_ROWS - 1 && colIdx <= props.NUM_COLUMNS - 1;
  }

  function sweepFromOrigin(rowIdx, colIdx) {
    let initMineCount = countAdjacentMines(rowIdx, colIdx);
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
            let mineCount = countAdjacentMines(r, c);
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

  function countAdjacentMines(rowIdx, colIdx) {
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
      <button disabled ={boardState.gameOver || boardState.gameWin} onClick={logState}>DEBUG: Log boardState</button>
      <button onClick={resetGame}>Restart</button>
      <p>{boardState.statusMessage}</p>
    </>
  );
}