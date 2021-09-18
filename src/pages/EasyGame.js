import React, {Component} from "react";
import Board from "../components/Board/Board";
import './pages_CSS/Game.css';
import Field from "../components/Board/Field";
import {Settings} from "../Settings";
import Timer from "../components/Timer/Timer";

export default class EasyGame extends Component {

  isTimerOn = (isOn) => {
    console.log('starting timer');
    return isOn;
  }
  //
  // endTimer = () => {
  //   console.log('stopping timer');
  //   return false;
  // }

  render() {
    return(
      <>
        <div className={'Game'}>
          <Board className={"Small-Board"}
                 FIELD={new Field(Settings["EasyGame"].rows, Settings["EasyGame"].cols, Settings["EasyGame"].mines)}
                 NUM_ROWS={Settings["EasyGame"].rows}
                 NUM_COLUMNS={Settings["EasyGame"].cols}
                 NUM_MINES={Settings["EasyGame"].mines}
          />
        </div>
    </>);
  }
}
