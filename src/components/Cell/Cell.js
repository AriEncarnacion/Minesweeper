import './Cell.css';
export const Cell = (props) => {

  return (
    <td className={"Cell"}
        onClick={() => props.handleClick(props.rowIdx, props.colIdx)}
        style={{backgroundColor: props.cell.color}}>
    </td>
  );
}

