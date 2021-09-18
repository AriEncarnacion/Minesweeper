import {Component} from "react";
import {Link} from "react-router-dom";
import './pages_CSS/Menu.css'

export default class Menu extends Component {
  render() {
    return(
      <div className={"Container"}>
        <div className={"Menu"}>
          <p className={"Title"}>
            M I N E S W E E P E R
          </p>

          <p className={"difficulty-info"}>
            BOARD: 8x8
            MINES: 10
          </p>

          <Link to={"/EasyGame"} style={{textDecoration: 'none'}}>
            <button className={"menuButton"}>Easy Game</button>
          </Link>

          <p> </p>

          <p className={"difficulty-info"}>
            BOARD: 16x16
            MINES: 40
          </p>

          <Link to={"/MediumGame"} style={{textDecoration: 'none'}}>
            <button className={"menuButton"}>Medium Game</button>
          </Link>

          <p> </p>

          <p className={"difficulty-info"}>
            BOARD: 16x30
            MINES: 99
          </p>

          <Link to={"/HardGame"} style={{textDecoration: 'none'}}>
            <button className={"menuButton"}>Hard Game</button>
          </Link>
        </div>
      </div>
    );
  }

}