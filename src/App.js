import './App.css';
import EasyGame from "./pages/EasyGame";

function App() {
  return (
    <EasyGame NUM_ROWS={5}
              NUM_COLUMNS={5}
              NUM_MINES={3}
    />
  );
}

export default App;
