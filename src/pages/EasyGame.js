import Board from "../components/Board/Board";
import GenerateField from "../components/Board/Field";
function EasyGame(props) {
  return (
    <Board className={"Small-Board"}
           FIELD={GenerateField(props.NUM_ROWS, props.NUM_COLUMNS, props.NUM_MINES)}
           NUM_ROWS={props.NUM_ROWS}
           NUM_COLUMNS={props.NUM_COLUMNS}
           NUM_MINES={props.NUM_MINES}
    />
  );
}

export default EasyGame;
