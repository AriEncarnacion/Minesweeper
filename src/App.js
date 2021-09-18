import './App.css';
// import EasyGame from "./pages/EasyGame";
// import MediumGame from "./pages/MediumGame";
// import HardGame from "./pages/HardGame";
import Menu from './pages/Menu'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import EasyGame from "./pages/EasyGame";
import MediumGame from "./pages/MediumGame";
import HardGame from "./pages/HardGame";

function App() {
  return (
    // <EasyGame NUM_ROWS={8}
    //           NUM_COLUMNS={8}
    //           NUM_MINES={10}
    // />
  // <MediumGame NUM_ROWS={16}
  //           NUM_COLUMNS={16}
  //           NUM_MINES={40}
  // />
  // <HardGame NUM_ROWS={16}
  //           NUM_COLUMNS={30}
  //           NUM_MINES={99}
  // />
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
