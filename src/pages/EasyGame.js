import React, {Component} from "react";
import Board from "../components/Board/Board";
import './EasyGame.css';
import Field from "../components/Board/Field";

class EasyGame extends Component {

  render() {
    return(
      <>
        <div className={'bg'}>
          <Board className={"Small-Board"}
                 FIELD={new Field(this.props.NUM_ROWS, this.props.NUM_COLUMNS, this.props.NUM_MINES)}
                 NUM_ROWS={this.props.NUM_ROWS}
                 NUM_COLUMNS={this.props.NUM_COLUMNS}
                 NUM_MINES={this.props.NUM_MINES}
          />
        </div>
    </>);
  }
}

export default EasyGame;
