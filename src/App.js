/*
Ari Encarnacion
CS 470, Dr. Kooshesh
Sonoma State University
18 September 2021

MineSweeper project.
Standard minesweeper rules apply.

*/

import './App.css';
import Menu from './pages/Menu'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import EasyGame from "./pages/EasyGame";
import MediumGame from "./pages/MediumGame";
import HardGame from "./pages/HardGame";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path={"/"}>
            <Menu />
          </Route>
          <Route path={"/EasyGame"}>
            <EasyGame/>
          </Route>
          <Route path={"/MediumGame"}>
            <MediumGame/>
          </Route>
          <Route path={"/HardGame"}>
            <HardGame/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
