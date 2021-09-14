export default function GenerateField(rows, cols, mines) {
  function getRandomCord() {
    return [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
  }

  function initMineCords() {
    let cords = [];
    for(let i = 0; i < mines; i++) {
      let colRowPair = getRandomCord();
      while(cords.includes( colRowPair )) {
        colRowPair = getRandomCord();
      }
      cords.push([colRowPair[0], colRowPair[1]]); // pushing [row, col]
    }
    return cords;
  }

  return initMineCords();
}