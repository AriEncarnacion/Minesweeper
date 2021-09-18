import React, {Component} from "react";
import Board from "../components/Board/Board";
import './pages_CSS/Game.css';
import Field from "../components/Board/Field";
import {Settings} from "../Settings";

export default class MediumGame extends Component {

  render() {
    return(
      <>
        <div className={'Game'}>
          <Board className={"Medium-Board"}
                 FIELD={new Field(Settings["MedGame"].rows, Settings["MedGame"].cols, Settings["MedGame"].mines)}
                 NUM_ROWS={Settings["MedGame"].rows}
                 NUM_COLUMNS={Settings["MedGame"].cols}
                 NUM_MINES={Settings["MedGame"].mines}
          />
        </div>
      </>);
  }
}
