import './App.css';
import EasyGame from "./pages/EasyGame";

function App() {
  return (
    <EasyGame NUM_ROWS={3}
              NUM_COLUMNS={3}
              NUM_MINES={5}
    />
  );
}

export default App;
