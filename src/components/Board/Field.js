export default class Field {

  //MARK: Logic for creating minefield

  constructor(rows, cols, numMines) {
    this.numRows = rows;
    this.numCols = cols;
    this.numMines = numMines;

    this.minefield = this.initMineCords();
    this.adjacentCords = this.setAdjacentCounts(this.minefield.slice());
  }

  getRandomCord() {
    return [Math.floor(Math.random() * this.numRows), Math.floor(Math.random() * this.numCols)];
  }

  cordsAreEqual(allCords, newCord) {
    for (let i = 0; i < allCords.length; i++) {
      if(JSON.stringify(allCords[i]) === JSON.stringify(newCord)) {
        return true;
      }
    }
    return false;
  }

  initMineCords() {
    let cords = [];
    let colRowPair = this.getRandomCord();
    cords.push(colRowPair); // pushes [row, col]

    while(cords.length < this.numMines) {
      colRowPair = this.getRandomCord();
      while (this.cordsAreEqual(cords.slice(), colRowPair.slice())) {
        colRowPair = this.getRandomCord();
      }
        cords.push(colRowPair); // pushes [row, col]
    }
    return cords;
    // return [[1,1],[2,2],[3,3]];
    // return [[1,1],[2,2]];
  }

  //MARK: Logic for setting up adjacent mine counts for entire board

  checkAdjacentCells(rowIdx, colIdx, minefield) {
    let mineCount = 0;
    for(let r = rowIdx - 1; r <= rowIdx + 1; r++) {
      for (let c = colIdx - 1; c <= colIdx + 1; c++) {
        if (this.checkForMines([r,c], minefield)) {
          mineCount++;
        }
      }
    }
    return mineCount;
  }

  checkForMines(selected, minefield) {
    for (let i = 0; i < minefield.length; i++) {
      if (minefield[i][0] === selected[0] && minefield[i][1] === selected[1]) {
        return true;
      }
    }
    return false;
  }

  setAdjacentCounts(minefield) {
    let adjacent = []
    for(let r = 0; r < this.numRows; r++) {
      for(let c = 0; c < this.numCols; c++) {
        if(!this.checkForMines([r,c], minefield.slice())) {
          let adjacentMines = this.checkAdjacentCells(r,c, minefield.slice());
          adjacent.push([r,c,adjacentMines]);
        } else {
        }
      }
    }
    return adjacent;
  }

  getMineCords() {
    return this.minefield;
  }

  getAdjacentInfo() {
    return this.adjacentCords;
  }
}