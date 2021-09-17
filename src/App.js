import './App.css';
import EasyGame from "./pages/EasyGame";

function App() {
  return (
    <EasyGame NUM_ROWS={15}
              NUM_COLUMNS={15}
              NUM_MINES={50}
    />
  );
}

export default App;
