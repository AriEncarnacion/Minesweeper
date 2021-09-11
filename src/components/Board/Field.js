export default function GenerateField(rows, cols, mines) {
  function getRandomCord() {
    return [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
  }

  function initMineCords() {
    let cords = {"mines": []};
    for(let i = 0; i < mines; i++) {
      let xy = getRandomCord()
      cords["mines"].push({x: xy[0], y: xy[1]});
    }
    return cords;
  }

  return initMineCords();
}