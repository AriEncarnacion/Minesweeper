export default function GenerateField(rows, cols, mines) {
  function getRandomCord() {
    return [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
  }

  function initMineCords() {
    let cords = [];
    for(let i = 0; i < mines; i++) {
      cords.push(getRandomCord());
    }
    return cords;
  }

  return initMineCords();
}