import './App.css';
import EasyGame from "./pages/EasyGame";

function App() {
  return (
    <EasyGame NUM_ROWS={8}
              NUM_COLUMNS={8}
              NUM_MINES={10}
    />
  );
}

export default App;
