import React, {Component} from "react";
import Board from "../components/Board/Board";
import './pages_CSS/Game.css';
import Field from "../components/Board/Field";
import {Settings} from "../Settings";
import Timer from "../components/Timer/Timer";

export default class HardGame extends Component {

  render() {
    return(
      <>
        <div className={'Game'}>
          <Board className={"Large-Board"}
                 FIELD={new Field(Settings["HardGame"].rows, Settings["HardGame"].cols, Settings["HardGame"].mines)}
                 NUM_ROWS={Settings["HardGame"].rows}
                 NUM_COLUMNS={Settings["HardGame"].cols}
                 NUM_MINES={Settings["HardGame"].mines}
          />
        </div>
      </>);
  }
}