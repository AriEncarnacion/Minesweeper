import {Component} from "react";
import {Link} from "react-router-dom";
import './pages_CSS/Menu.css'

export default class Menu extends Component {
  render() {
    return(
      <>
        <div className={"Menu"}>
          <Link to={"/EasyGame"}>
            <button className={"menuButton"}>Easy Game</button>
          </Link>

          <p></p>

          <Link to={"/MediumGame"}>
            <button className={"menuButton"}>Medium Game</button>
          </Link>

          <p></p>

          <Link to={"/HardGame"}>
            <button className={"menuButton"}>Hard Game</button>
          </Link>
        </div>
      </>
    );
  }

}