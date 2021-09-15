export default function GenerateField(rows, cols, numMines) {
  function getRandomCord() {
    return [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
  }

  function cordsAreEqual(allCords, newCord) {
    for (let i = 0; i < allCords.length; i++) {
      if(JSON.stringify(allCords[i]) === JSON.stringify(newCord)) {
        return true;
      }
    }
    return false;
  }

  function initMineCords() {
    let cords = [];
    let colRowPair = getRandomCord();
    cords.push(colRowPair); // pushes [row, col]

    while(cords.length < numMines) {
      colRowPair = getRandomCord();
      while (cordsAreEqual(cords.slice(), colRowPair.slice())) {
        colRowPair = getRandomCord();
      }
        cords.push(colRowPair); // pushes [row, col]
    }
    return cords;
  }

  return initMineCords();
}