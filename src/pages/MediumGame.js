import React, {Component} from "react";
import Board from "../components/Board/Board";
import './MediumGame.css';
import Field from "../components/Board/Field";

export default class MediumGame extends Component {

  render() {
    return(
      <>
        <div className={'Easy-Game'}>
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
