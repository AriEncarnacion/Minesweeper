export const Cell = (props) => {

  return (
    <td onClick={() => props.handleClick(props.rowIdx, props.colIdx)} width="50px" height="50px"
        style={{backgroundColor: props.cell.color}}>
    </td>
  );
}

