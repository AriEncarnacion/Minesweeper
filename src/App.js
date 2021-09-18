import './App.css';
import EasyGame from "./pages/EasyGame";
import MediumGame from "./pages/MediumGame";
import HardGame from "./pages/HardGame";

function App() {
  return (
    // <EasyGame NUM_ROWS={8}
    //           NUM_COLUMNS={8}
    //           NUM_MINES={10}
    // />
  <MediumGame NUM_ROWS={16}
            NUM_COLUMNS={16}
            NUM_MINES={40}
  />
  // <HardGame NUM_ROWS={16}
  //           NUM_COLUMNS={30}
  //           NUM_MINES={99}
  // />
  );
}

export default App;
