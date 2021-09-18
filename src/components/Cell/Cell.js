import './Cell.css';

export const Cell = (props) => {

  return (
    <td className={"Cell"}
        onClick={() => props.handleClick(props.rowIdx, props.colIdx)}
        onContextMenu={(e) => props.handleRightClick(e, props.rowIdx, props.colIdx, props.cell.isFlagged)}
        style={{backgroundColor: props.cell.color}}>
      {props.cell.number}</td>
  );
}

