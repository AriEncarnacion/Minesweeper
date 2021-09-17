import './App.css';
import EasyGame from "./pages/EasyGame";

function App() {
  return (
    <EasyGame NUM_ROWS={4}
              NUM_COLUMNS={4}
              NUM_MINES={1}
    />
  );
}

export default App;
