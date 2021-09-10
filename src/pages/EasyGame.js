import Board from "../components/Board/Board";

function EasyGame() {
  return (
    <Board className={"Small-Board"} NUM_ROWS={8} NUM_COLUMNS={8} NUM_MINES={10}/>
  );
}

export default EasyGame;
