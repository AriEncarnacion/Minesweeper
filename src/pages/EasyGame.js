import React, {Component} from "react";
import Board from "../components/Board/Board";
import GenerateField from "../components/Board/Field";
import './EasyGame.css';

class EasyGame extends Component {

  render() {
    return(
      <>
        <div className={'bg'}>
          <Board className={"Small-Board"}
                 FIELD={GenerateField(this.props.NUM_ROWS, this.props.NUM_COLUMNS, this.props.NUM_MINES)}
                 NUM_ROWS={this.props.NUM_ROWS}
                 NUM_COLUMNS={this.props.NUM_COLUMNS}
                 NUM_MINES={this.props.NUM_MINES}
          />
        </div>
    </>);
  }
}

export default EasyGame;
